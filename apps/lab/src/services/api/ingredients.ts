/**
 * MEJUNJE Backoffice Ingredients API Service
 * Interacts with BlueHost PHP REST API endpoint: /ingredients
 */

import { Ingredient, InsumoCategory } from '@/types';
import { apiRequest } from './client';

export interface CreateIngredientInput {
  name: string;
  category: InsumoCategory | string;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'unid' | '%';
  purchasePriceARS: number;
  referenceQty: number;
  stock?: number;
  minStock?: number;
  supplierId?: string | null;
  imageUrl?: string | null;
}

export interface UpdateIngredientInput extends Partial<CreateIngredientInput> {}

/**
 * Fetch all active ingredients from real MySQL database.
 * Joined with active supplier name (supplierName).
 */
export async function getIngredientsApi(): Promise<Ingredient[]> {
  const data = await apiRequest<Ingredient[]>('/ingredients', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch a single active ingredient by ID.
 */
export async function getIngredientByIdApi(id: string): Promise<Ingredient> {
  return await apiRequest<Ingredient>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/**
 * Create a new ingredient in MySQL database.
 * Server calculates unitCostARS = purchasePriceARS / referenceQty.
 * Server generates unique ID ing-<hex>.
 */
export async function createIngredientApi(input: CreateIngredientInput): Promise<Ingredient> {
  return await apiRequest<Ingredient>('/ingredients', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Update an existing active ingredient in MySQL database.
 * Recalculates unitCostARS if price or referenceQty changes.
 */
export async function updateIngredientApi(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
  return await apiRequest<Ingredient>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/**
 * Soft delete ingredient in MySQL database (sets is_active = 0).
 */
export async function deleteIngredientApi(id: string): Promise<{ id: string; deleted: boolean; message: string }> {
  return await apiRequest<{ id: string; deleted: boolean; message: string }>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
