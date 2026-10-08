/**
 * MEJUNJE Backoffice Ingredients API Service
 * Interacts with BlueHost PHP REST API endpoint: /ingredients
 */

import { Ingredient, InsumoCategory } from '@/types';
import { apiRequest } from './client';

export interface IngredientApiDto {
  id: string;
  name: string;
  category: string;
  unit: Ingredient['unit'];
  purchasePriceARS: number;
  referenceQty: number;
  unitCostARS: number;
  stock: number;
  minStock: number;
  supplierId: string | null;
  supplierName: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalizes raw PHP API DTO to frontend canonical Ingredient model.
 * Handles null supplierId/supplierName, derives lastUpdated from updatedAt/createdAt.
 */
export function mapIngredientApiDto(dto: IngredientApiDto): Ingredient {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category as InsumoCategory,
    unit: dto.unit,
    purchasePriceARS: Number(dto.purchasePriceARS),
    referenceQty: Number(dto.referenceQty),
    unitCostARS: Number(dto.unitCostARS),
    stock: Number(dto.stock),
    minStock: Number(dto.minStock),
    supplierId: dto.supplierId ?? '',
    supplierName: dto.supplierName ?? '',
    imageUrl: dto.imageUrl ?? undefined,
    lastUpdated: dto.updatedAt || dto.createdAt || '',
  };
}

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
  const data = await apiRequest<IngredientApiDto[]>('/ingredients', {
    method: 'GET',
  });
  return Array.isArray(data) ? data.map(mapIngredientApiDto) : [];
}

/**
 * Fetch a single active ingredient by ID.
 */
export async function getIngredientByIdApi(id: string): Promise<Ingredient> {
  const dto = await apiRequest<IngredientApiDto>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  return mapIngredientApiDto(dto);
}

/**
 * Create a new ingredient in MySQL database.
 * Server calculates unitCostARS = purchasePriceARS / referenceQty.
 * Server generates unique ID ing-<hex>.
 */
export async function createIngredientApi(input: CreateIngredientInput): Promise<Ingredient> {
  const dto = await apiRequest<IngredientApiDto>('/ingredients', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapIngredientApiDto(dto);
}

/**
 * Update an existing active ingredient in MySQL database.
 * Recalculates unitCostARS if price or referenceQty changes.
 */
export async function updateIngredientApi(id: string, input: UpdateIngredientInput): Promise<Ingredient> {
  const dto = await apiRequest<IngredientApiDto>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return mapIngredientApiDto(dto);
}

/**
 * Soft delete ingredient in MySQL database (sets is_active = 0).
 */
export async function deleteIngredientApi(id: string): Promise<{ id: string; deleted: boolean; message: string }> {
  return await apiRequest<{ id: string; deleted: boolean; message: string }>(`/ingredients?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
