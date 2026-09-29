/**
 * Storefront Catalog Data Mapper (01-ECO)
 * Maps raw database query results from 02-CAT to public DTO contracts (@mejunje/contracts)
 * and UI presentation objects for storefront components.
 */

import type {
  CatalogProductDTO,
  CatalogProductDetailDTO,
  CatalogVariantDTO,
  CatalogPriceDTO,
  CatalogCategoryDTO,
  OlfactoryPyramidDTO,
  CatalogMediaDTO,
} from '@mejunje/contracts';

import type { Product, OlfactoryPyramid, OlfactoryFamily } from '../data/catalog';

/**
 * Builds a public URL for a catalog media asset stored in the catalog-media bucket.
 */
export function buildCatalogMediaUrl(filePath: string, customSupabaseUrl?: string): string {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  const baseUrl = customSupabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!baseUrl) {
    return `/storage/catalog-media/${filePath.replace(/^\//, '')}`;
  }
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = filePath.replace(/^\//, '');
  return `${cleanBase}/storage/v1/object/public/catalog-media/${cleanPath}`;
}

/**
 * Maps raw database product join rows to public CatalogProductDetailDTO.
 * Normalizes nulls, sorts media by display_order, handles missing relations.
 */
export function mapDbProductToDTO(
  row: any,
  customSupabaseUrl?: string
): CatalogProductDetailDTO {
  if (!row) {
    throw new Error('Cannot map null database product row');
  }

  // 1. Categories
  const rawCategoryMappings = Array.isArray(row.product_category_mappings)
    ? row.product_category_mappings
    : [];
  const categories: CatalogCategoryDTO[] = rawCategoryMappings
    .map((m: any) => {
      const cat = m.product_categories || m.category;
      if (!cat) return null;
      return {
        id: cat.id || '',
        slug: cat.slug || '',
        name: cat.name || '',
        description: cat.description || null,
        parentId: cat.parent_id || null,
      };
    })
    .filter((c: CatalogCategoryDTO | null): c is CatalogCategoryDTO => c !== null);

  // 2. Variants & Prices
  const rawVariants = Array.isArray(row.product_variants) ? row.product_variants : [];
  const variants: CatalogVariantDTO[] = rawVariants
    .filter((v: any) => v && v.is_active !== false)
    .map((v: any) => {
      const rawPrices = Array.isArray(v.prices) ? v.prices : [];
      const activePriceObj = rawPrices.find((p: any) => p && p.is_active !== false);

      let priceDTO: CatalogPriceDTO | null = null;
      if (activePriceObj && typeof activePriceObj.amount === 'number') {
        priceDTO = {
          amount: Number(activePriceObj.amount),
          currency: activePriceObj.currency || 'ARS',
          isActive: activePriceObj.is_active !== false,
        };
      }

      return {
        id: v.id || '',
        sku: v.sku || '',
        name: v.name || '',
        isActive: v.is_active !== false,
        price: priceDTO,
      };
    });

  // 3. Olfactory Pyramid
  const rawPyramid = row.olfactory_pyramids
    ? Array.isArray(row.olfactory_pyramids)
      ? row.olfactory_pyramids[0]
      : row.olfactory_pyramids
    : null;

  let olfactoryPyramid: OlfactoryPyramidDTO | null = null;
  if (rawPyramid) {
    olfactoryPyramid = {
      topNotes: Array.isArray(rawPyramid.top_notes) ? rawPyramid.top_notes : [],
      heartNotes: Array.isArray(rawPyramid.heart_notes) ? rawPyramid.heart_notes : [],
      baseNotes: Array.isArray(rawPyramid.base_notes) ? rawPyramid.base_notes : [],
      description: rawPyramid.description || null,
    };
  }

  // 4. Media
  const rawMedia = Array.isArray(row.catalog_media) ? row.catalog_media : [];
  const media: CatalogMediaDTO[] = rawMedia
    .map((m: any) => ({
      id: m.id || '',
      filePath: buildCatalogMediaUrl(m.file_path || m.filePath || '', customSupabaseUrl),
      altText: m.alt_text || m.altText || null,
      displayOrder: typeof m.display_order === 'number' ? m.display_order : 0,
      isPrimary: Boolean(m.is_primary || m.isPrimary),
      mediaType: (m.media_type || 'image') as 'image' | 'video' | 'document',
    }))
    .sort((a: CatalogMediaDTO, b: CatalogMediaDTO) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.displayOrder - b.displayOrder;
    });

  const isPublished = row.status === 'published';

  return {
    id: row.id || '',
    slug: row.slug || '',
    name: row.name || '',
    description: row.description || null,
    status: row.status || 'draft',
    isPublished,
    categories,
    variants,
    olfactoryPyramid,
    media,
    metadata: row.metadata || {},
  };
}

/**
 * Maps a public CatalogProductDTO to the UI-presentation Product interface expected by Storefront components.
 */
export function mapCatalogDTOToStorefrontProduct(dto: CatalogProductDTO | CatalogProductDetailDTO): Product {
  const primaryCategory = dto.categories[0];
  const categoryLabel = primaryCategory ? primaryCategory.name : 'Botica & Atelier';
  const rawCatSlug = primaryCategory ? primaryCategory.slug.toUpperCase() : 'VELAS';
  
  let category: 'VELAS' | 'DIFUSORES' | 'HOME_SPRAYS' | 'TEXTILES' | 'SETS' = 'VELAS';
  if (rawCatSlug.includes('DIFUSOR')) category = 'DIFUSORES';
  else if (rawCatSlug.includes('SPRAY')) category = 'HOME_SPRAYS';
  else if (rawCatSlug.includes('TEXTIL')) category = 'TEXTILES';
  else if (rawCatSlug.includes('SET') || rawCatSlug.includes('BLEND')) category = 'SETS';

  const firstVariantWithPrice = dto.variants.find((v) => v.price && v.price.amount > 0);
  const price = firstVariantWithPrice && firstVariantWithPrice.price ? firstVariantWithPrice.price.amount : 0;

  const topNotes = dto.olfactoryPyramid?.topNotes || [];
  const heartNotes = dto.olfactoryPyramid?.heartNotes || [];
  const baseNotes = dto.olfactoryPyramid?.baseNotes || [];
  const mainNotes = [...topNotes, ...heartNotes].slice(0, 3);

  const images = dto.media.map((m) => m.filePath);
  const sizeVolume = dto.variants[0]?.name || 'Formato Atelier';

  const metadata = (dto as CatalogProductDetailDTO).metadata || {};

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    category,
    categoryLabel,
    aromaticFamily: (metadata.aromaticFamily as OlfactoryFamily) || 'Amaderado',
    mainNotes: mainNotes.length > 0 ? mainNotes : ['Notas Botánicas'],
    price,
    sizeVolume,
    shortStory: (metadata.shortStory as string) || dto.description || 'Mejunje botánico formulado en lotes pequeños.',
    poeticDescription: (metadata.poeticDescription as string) || dto.description || '',
    feelsLike: (metadata.feelsLike as string) || (topNotes.length > 0 ? topNotes.join(', ') : 'Aromas naturales'),
    intensity: typeof metadata.intensity === 'number' ? metadata.intensity : 3,
    idealForRooms: Array.isArray(metadata.idealForRooms) ? metadata.idealForRooms : ['Living', 'Habitación'],
    pyramid: {
      topNotes,
      heartNotes,
      baseNotes,
    },
    moodTags: Array.isArray(metadata.moodTags) ? metadata.moodTags : ['mood_calma'],
    companionProductSlugs: Array.isArray(metadata.companionProductSlugs) ? metadata.companionProductSlugs : [],
    isFeatured: Boolean(metadata.isFeatured),
    isBestseller: Boolean(metadata.isBestseller),
    stock: 10,
    badge: (metadata.badge as string) || undefined,
    accentColor: (metadata.accentColor as string) || '#C87D38',
    imageBg: (metadata.imageBg as string) || '#F7F4EF',
    visualType: (metadata.visualType as any) || (category === 'DIFUSORES' ? 'diffuser' : category === 'HOME_SPRAYS' ? 'spray' : 'candle'),
    images,
  };
}
