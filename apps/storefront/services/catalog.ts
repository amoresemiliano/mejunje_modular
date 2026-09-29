/**
 * Storefront Catalog Data Access Service (01-ECO)
 * Encapsulates public Supabase catalog queries, error handling, and DTO transformation.
 * Security Invariant: Uses public anon key only. Never uses service_role key.
 */

import { createBrowserSupabaseClient } from '@mejunje/auth';
import type { CatalogProductDTO, CatalogProductDetailDTO } from '@mejunje/contracts';
import type { Product } from '../data/catalog';
import { mapDbProductToDTO, mapCatalogDTOToStorefrontProduct } from './catalog-mapper.ts';

/**
 * Fetches all published products from 02-CAT database foundation.
 * Returns empty array cleanly on database errors or unconfigured environment.
 */
export async function getPublishedProducts(customClient?: any): Promise<CatalogProductDTO[]> {
  try {
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

    if (error || !data) {
      return [];
    }

    return data.map((row: any) => mapDbProductToDTO(row));
  } catch (err) {
    // Fail closed quietly without exposing technical database details
    return [];
  }
}

/**
 * Fetches a single published product by slug from 02-CAT database foundation.
 * Returns null if not found, non-published, or database query error occurs.
 */
export async function getPublishedProductBySlug(
  slug: string,
  customClient?: any
): Promise<CatalogProductDetailDTO | null> {
  if (!slug || slug.trim() === '') {
    return null;
  }

  try {
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

    if (error || !data) {
      return null;
    }

    return mapDbProductToDTO(data);
  } catch (err) {
    // Fail closed quietly without exposing technical database details
    return null;
  }
}

/**
 * Fetches published products transformed to Storefront UI Product objects.
 */
export async function getStorefrontProducts(customClient?: any): Promise<Product[]> {
  const dtos = await getPublishedProducts(customClient);
  return dtos.map(mapCatalogDTOToStorefrontProduct);
}

/**
 * Fetches single published product by slug transformed to Storefront UI Product object.
 */
export async function getStorefrontProductBySlug(
  slug: string,
  customClient?: any
): Promise<Product | null> {
  const dto = await getPublishedProductBySlug(slug, customClient);
  if (!dto) return null;
  return mapCatalogDTOToStorefrontProduct(dto);
}
