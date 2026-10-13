import { CatalogProduct } from '@/types';
import { apiRequest } from './client';
import { requireRealId, validateBusinessReferences } from './businessGuards';

export interface ProductVariantDto {
  id: string;
  sku: string;
  size: string;
  unit: string;
  aroma: string;
  salePriceARS: number;
  estimatedCostARS: number;
  suggestedSalePriceARS: number | null;
  marginPercent: number | null;
  status: 'Activo' | 'Inactivo';
}
export interface ProductApiDto {
  id: string;
  sku: string;
  name: string;
  category: CatalogProduct['category'];
  description: string;
  shortDescription: string;
  collection: string;
  fragranceFamily: string;
  status: CatalogProduct['status'];
  formulaId: string | null;
  formulaName: string | null;
  imageUrl: string | null;
  images: string[];
  badge: string | null;
  topNotes: string | null;
  heartNotes: string | null;
  baseNotes: string | null;
  variants: ProductVariantDto[];
}

export function mapProductApiDto(dto: ProductApiDto): CatalogProduct {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    category: dto.category,
    description: dto.description,
    shortDescription: dto.shortDescription,
    collection: dto.collection,
    fragranceFamily: dto.fragranceFamily,
    status: dto.status,
    formulaId: dto.formulaId ?? undefined,
    formulaName: dto.formulaName ?? undefined,
    imageUrl: dto.imageUrl ?? undefined,
    images: dto.images,
    badge: dto.badge ?? undefined,
    topNotes: dto.topNotes ?? undefined,
    heartNotes: dto.heartNotes ?? undefined,
    baseNotes: dto.baseNotes ?? undefined,
    variants: dto.variants.map(v => ({ id: v.id, sku: v.sku, size: v.size, unit: v.unit, aroma: v.aroma, salePriceARS: Number(v.salePriceARS), estimatedCostARS: Number(v.estimatedCostARS), suggestedSalePriceARS: v.suggestedSalePriceARS == null ? undefined : Number(v.suggestedSalePriceARS), marginPercent: v.marginPercent == null ? undefined : Number(v.marginPercent), status: v.status })),
  };
}
export interface ProductWriteDto {
  sku?: CatalogProduct['sku'];
  name?: CatalogProduct['name'];
  category?: CatalogProduct['category'];
  description?: CatalogProduct['description'];
  shortDescription?: CatalogProduct['shortDescription'];
  collection?: CatalogProduct['collection'];
  fragranceFamily?: CatalogProduct['fragranceFamily'];
  status?: CatalogProduct['status'];
  formulaId?: string | null;
  imageUrl?: CatalogProduct['imageUrl'];
  images?: CatalogProduct['images'];
  badge?: CatalogProduct['badge'];
  topNotes?: CatalogProduct['topNotes'];
  heartNotes?: CatalogProduct['heartNotes'];
  baseNotes?: CatalogProduct['baseNotes'];
  variants?: { sku: string; size: string; unit: string; aroma: string; salePriceARS: number; estimatedCostARS: number; marginPercent?: number; status: 'Activo' | 'Inactivo' }[];
}
function writePayload(input: Partial<CatalogProduct>): ProductWriteDto {
  if (input.id) requireRealId(input.id, 'prod');
  return {
    sku: input.sku,
    name: input.name,
    category: input.category,
    description: input.description,
    shortDescription: input.shortDescription,
    collection: input.collection,
    fragranceFamily: input.fragranceFamily,
    status: input.status,
    formulaId: Object.prototype.hasOwnProperty.call(input, 'formulaId') ? input.formulaId || null : undefined,
    imageUrl: input.imageUrl,
    images: input.images,
    badge: input.badge,
    topNotes: input.topNotes,
    heartNotes: input.heartNotes,
    baseNotes: input.baseNotes,
    variants: input.variants?.map(v => ({ sku: v.sku, size: v.size, unit: v.unit, aroma: v.aroma, salePriceARS: v.salePriceARS, estimatedCostARS: v.estimatedCostARS, marginPercent: v.marginPercent, status: v.status })),
  };
}

export async function getCatalogProductsApi(): Promise<CatalogProduct[]> {
  return (await apiRequest<ProductApiDto[]>('/catalog-products', { cache: 'no-store' })).map(mapProductApiDto);
}
export async function getProductByIdApi(id: string): Promise<CatalogProduct> {
  requireRealId(id, 'prod');
  return mapProductApiDto(await apiRequest<ProductApiDto>(`/catalog-products?id=${encodeURIComponent(id)}`, { cache: 'no-store' }));
}
export async function createProductApi(input: Omit<CatalogProduct, 'id'>): Promise<CatalogProduct> {
  validateBusinessReferences(input);
  return mapProductApiDto(await apiRequest<ProductApiDto>('/catalog-products', { method: 'POST', body: JSON.stringify(writePayload(input)) }));
}
export async function updateProductApi(id: string, input: Partial<CatalogProduct>): Promise<CatalogProduct> {
  requireRealId(id, 'prod'); validateBusinessReferences(input);
  return mapProductApiDto(await apiRequest<ProductApiDto>(`/catalog-products?id=${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(writePayload(input)) }));
}
export async function deleteProductApi(id: string): Promise<void> {
  requireRealId(id, 'prod');
  await apiRequest(`/catalog-products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}
