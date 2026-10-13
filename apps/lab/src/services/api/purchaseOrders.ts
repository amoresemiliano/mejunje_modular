/**
 * MEJUNJE Backoffice Purchase Orders API Service
 * Interacts with BlueHost PHP REST API endpoint: /purchase-orders
 */

import { PurchaseOrder, PurchaseItem } from '@/types';
import { apiRequest } from './client';

export interface PurchaseOrderItemApiDto {
  id: string;
  ingredientId: string | null;
  ingredientName: string;
  unit: string;
  requiredQty: number;
  unitPriceARS: number;
  subtotalARS: number;
}

export interface PurchaseOrderApiDto {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  date: string;
  status: 'Borrador' | 'Pendiente' | 'Solicitada' | 'Confirmada' | 'Recibida' | 'Cancelada';
  items: PurchaseOrderItemApiDto[];
  subtotalARS: number;
  totalARS: number;
  observations: string | null;
  receivedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalizes raw PHP API DTO to frontend canonical PurchaseOrder model.
 */
export function mapPurchaseOrderApiDto(dto: PurchaseOrderApiDto): PurchaseOrder {
  return {
    id: dto.id,
    code: dto.code,
    supplierId: dto.supplierId ?? '',
    supplierName: dto.supplierName ?? '',
    date: dto.date ?? '',
    status: dto.status,
    items: (dto.items || []).map((item) => ({
      id: item.id,
      ingredientId: item.ingredientId ?? undefined,
      ingredientName: item.ingredientName ?? '',
      unit: item.unit ?? '',
      requiredQty: Number(item.requiredQty),
      unitPriceARS: Number(item.unitPriceARS),
      subtotalARS: Number(item.subtotalARS),
    })),
    subtotalARS: Number(dto.subtotalARS),
    totalARS: Number(dto.totalARS),
    observations: dto.observations ?? undefined,
    receivedAt: dto.receivedAt ?? undefined,
  };
}

export interface CreatePurchaseOrderItemInput {
  ingredientId: string;
  requiredQty: number;
  unitPriceARS: number;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  date?: string;
  items: CreatePurchaseOrderItemInput[];
  status?: 'Borrador' | 'Pendiente' | 'Solicitada' | 'Confirmada' | 'Recibida' | 'Cancelada';
  observations?: string;
}

export interface UpdatePurchaseOrderInput {
  status?: 'Borrador' | 'Pendiente' | 'Solicitada' | 'Confirmada' | 'Recibida' | 'Cancelada';
  observations?: string;
}

/**
 * Fetch all active purchase orders from real MySQL database.
 */
export async function getPurchaseOrdersApi(): Promise<PurchaseOrder[]> {
  const data = await apiRequest<PurchaseOrderApiDto[]>('/purchase-orders', {
    method: 'GET',
  });
  return Array.isArray(data) ? data.map(mapPurchaseOrderApiDto) : [];
}

/**
 * Fetch a single active purchase order by ID.
 */
export async function getPurchaseOrderByIdApi(id: string): Promise<PurchaseOrder> {
  const dto = await apiRequest<PurchaseOrderApiDto>(`/purchase-orders?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  return mapPurchaseOrderApiDto(dto);
}

/**
 * Create a new purchase order in MySQL database.
 * Server calculates subtotals and totals.
 */
export async function createPurchaseOrderApi(input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
  const dto = await apiRequest<PurchaseOrderApiDto>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapPurchaseOrderApiDto(dto);
}

/**
 * Update an existing active purchase order status/observations.
 * If status changes to 'Recibida', triggers server-side atomic stock update.
 */
export async function updatePurchaseOrderApi(id: string, input: UpdatePurchaseOrderInput): Promise<PurchaseOrder> {
  const dto = await apiRequest<PurchaseOrderApiDto>(`/purchase-orders?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return mapPurchaseOrderApiDto(dto);
}

/**
 * Soft delete purchase order in MySQL database.
 * Fails if order status is 'Recibida'.
 */
export async function deletePurchaseOrderApi(id: string): Promise<{ id: string; deleted: boolean; message: string }> {
  return await apiRequest<{ id: string; deleted: boolean; message: string }>(`/purchase-orders?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
