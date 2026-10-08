/**
 * MEJUNJE Backoffice Suppliers API Service
 * Interacts with BlueHost PHP REST API endpoint: /suppliers
 */

import { Supplier } from '@/types';
import { apiRequest } from './client';

export interface CreateSupplierInput {
  name: string;
  contactPerson?: string;
  phoneWhatsApp?: string;
  email?: string;
  web?: string;
  location?: string;
  categoriesSupplied?: string[];
  minPurchaseARS?: number;
  deliveryTimeDays?: number;
  notes?: string;
  imageUrl?: string;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {}

/**
 * Fetch all active suppliers from real MySQL database.
 */
export async function getSuppliersApi(): Promise<Supplier[]> {
  const data = await apiRequest<Supplier[]>('/suppliers', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch a single active supplier by ID.
 */
export async function getSupplierByIdApi(id: string): Promise<Supplier> {
  return await apiRequest<Supplier>(`/suppliers?id=${encodeURIComponent(id)}`, {
    method: 'GET',
  });
}

/**
 * Create a new supplier in MySQL database.
 * ID is generated server-side by API (e.g. sup-...).
 */
export async function createSupplierApi(input: CreateSupplierInput): Promise<Supplier> {
  return await apiRequest<Supplier>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Update an existing active supplier in MySQL database.
 */
export async function updateSupplierApi(id: string, input: UpdateSupplierInput): Promise<Supplier> {
  return await apiRequest<Supplier>(`/suppliers?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/**
 * Soft delete supplier in MySQL database (sets is_active = 0).
 */
export async function deleteSupplierApi(id: string): Promise<{ id: string; deleted: boolean; message: string }> {
  return await apiRequest<{ id: string; deleted: boolean; message: string }>(`/suppliers?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
