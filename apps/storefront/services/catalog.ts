/**
 * Storefront Catalog Data Access Service (01-ECO)
 * Encapsulates public Supabase catalog queries, data mode selection (LIVE vs DEMO),
 * error handling, and DTO transformation.
 * Security Invariant: Uses public anon key only. Never uses service_role key.
 * Data Source Principle: LIVE (02-CAT) and DEMO (synthetic fixtures) are explicit.
 * LIVE mode never falls back silently to DEMO fixtures on error or empty catalog.
 */

import { createBrowserSupabaseClient } from '@mejunje/auth';
import type { CatalogProductDTO, CatalogProductDetailDTO } from '@mejunje/contracts';
import { PRODUCTS, type Product } from '../data/catalog.ts';
import { mapDbProductToDTO, mapCatalogDTOToStorefrontProduct } from './catalog-mapper.ts';

export type DataMode = 'live' | 'demo';

/**
 * Returns the currently active data mode based on NEXT_PUBLIC_DATA_MODE.
 * Defaults to 'live' unless explicitly set to 'demo'.
 */
export function getDataMode(): DataMode {
  const envMode = process.env.NEXT_PUBLIC_DATA_MODE;
  if (envMode === 'demo') {
    return 'demo';
  }
  return 'live';
}

export interface StorefrontProductsOptions {
  mode?: DataMode;
  customClient?: any;
}

export interface StorefrontProductsResult {
  products: Product[];
  isError: boolean;
  mode: DataMode;
}

export interface StorefrontProductDetailResult {
  product: Product | null;
  isNotFound: boolean;
  isError: boolean;
  mode: DataMode;
}

/**
 * Low-level DB fetcher: Fetches raw published product DTOs from 02-CAT database foundation.
 * Throws error if DB query fails so higher-level boundary can distinguish error vs empty.
 */
export async function getPublishedProducts(customClient?: any): Promise<CatalogProductDTO[]> {
  const client = customClient || createBrowserSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select(`
      id,
      slug,
      name,
      description,
      status,
      metadata,
      created_at,
      updated_at,
      product_variants (
        id,
        sku,
        name,
        is_active,
        created_at,
        updated_at,
        prices (
          id,
          amount,
          currency,
          is_active
        )
      ),
      product_category_mappings (
        product_categories (
          id,
          slug,
          name,
          description,
          parent_id
        )
      ),
      olfactory_pyramids (
        id,
        top_notes,
        heart_notes,
        base_notes,
        description
      ),
      catalog_media (
        id,
        file_path,
        alt_text,
        display_order,
        is_primary,
        media_type
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Catalog DB Error: ${error.message || 'Failed to query published products'}`);
  }

  if (!data) {
    return [];
  }

  return data.map((row: any) => mapDbProductToDTO(row));
}

/**
 * Low-level DB fetcher: Fetches single published product DTO by slug from 02-CAT.
 * Throws error if DB query fails, or returns null if not found.
 */
export async function getPublishedProductBySlug(
  slug: string,
  customClient?: any
): Promise<CatalogProductDetailDTO | null> {
  if (!slug || slug.trim() === '') {
    return null;
  }

  const client = customClient || createBrowserSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select(`
      id,
      slug,
      name,
      description,
      status,
      metadata,
      created_at,
      updated_at,
      product_variants (
        id,
        sku,
        name,
        is_active,
        created_at,
        updated_at,
        prices (
          id,
          amount,
          currency,
          is_active
        )
      ),
      product_category_mappings (
        product_categories (
          id,
          slug,
          name,
          description,
          parent_id
        )
      ),
      olfactory_pyramids (
        id,
        top_notes,
        heart_notes,
        base_notes,
        description
      ),
      catalog_media (
        id,
        file_path,
        alt_text,
        display_order,
        is_primary,
        media_type
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('JSON object requested, multiple (or no) rows returned')) {
      return null; // Not found / not published
    }
    throw new Error(`Catalog DB Error: ${error.message || 'Failed to query product by slug'}`);
  }

  if (!data) {
    return null;
  }

  return mapDbProductToDTO(data);
}

/**
 * Main Storefront Catalog Data Boundary for Product Listing.
 * Explicitly resolves LIVE vs DEMO mode. Never falls back to DEMO on LIVE error.
 */
export async function getStorefrontProductsResult(
  options?: StorefrontProductsOptions
): Promise<StorefrontProductsResult> {
  const mode = options?.mode || getDataMode();

  if (mode === 'demo') {
    return {
      products: PRODUCTS,
      isError: false,
      mode: 'demo',
    };
  }

  // LIVE MODE
  try {
    const dtos = await getPublishedProducts(options?.customClient);
    const products = dtos.map((dto) => mapCatalogDTOToStorefrontProduct(dto, { mode: 'live' }));
    return {
      products,
      isError: false,
      mode: 'live',
    };
  } catch (err) {
    // Fail closed cleanly: return empty array with isError=true (NO fallback to DEMO!)
    return {
      products: [],
      isError: true,
      mode: 'live',
    };
  }
}

/**
 * Main Storefront Catalog Data Boundary for Product Detail Page (PDP).
 * Explicitly resolves LIVE vs DEMO mode. Never falls back to DEMO on LIVE error.
 */
export async function getStorefrontProductBySlugResult(
  slug: string,
  options?: StorefrontProductsOptions
): Promise<StorefrontProductDetailResult> {
  const mode = options?.mode || getDataMode();

  if (!slug || slug.trim() === '') {
    return {
      product: null,
      isNotFound: true,
      isError: false,
      mode,
    };
  }

  if (mode === 'demo') {
    const demoProduct = PRODUCTS.find((p) => p.slug === slug) || null;
    return {
      product: demoProduct,
      isNotFound: !demoProduct,
      isError: false,
      mode: 'demo',
    };
  }

  // LIVE MODE
  try {
    const dto = await getPublishedProductBySlug(slug, options?.customClient);
    if (!dto) {
      return {
        product: null,
        isNotFound: true,
        isError: false,
        mode: 'live',
      };
    }

    const product = mapCatalogDTOToStorefrontProduct(dto, { mode: 'live' });
    return {
      product,
      isNotFound: false,
      isError: false,
      mode: 'live',
    };
  } catch (err) {
    // Fail closed cleanly: return null with isError=true (NO fallback to DEMO!)
    return {
      product: null,
      isNotFound: false,
      isError: true,
      mode: 'live',
    };
  }
}

/**
 * Convenience helper returning products array for listing.
 */
export async function getStorefrontProducts(customClient?: any): Promise<Product[]> {
  const result = await getStorefrontProductsResult({ customClient });
  return result.products;
}

/**
 * Convenience helper returning single product or null.
 */
export async function getStorefrontProductBySlug(
  slug: string,
  customClient?: any
): Promise<Product | null> {
  const result = await getStorefrontProductBySlugResult(slug, { customClient });
  return result.product;
}
