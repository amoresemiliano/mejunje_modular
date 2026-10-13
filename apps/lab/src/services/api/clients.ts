import { ClientContact } from '@/types';
import { apiRequest } from './client';
import { requireRealId } from './businessGuards';

export interface ClientApiDto {
  id: string;
  name: string;
  phone: string;
  type: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: ClientContact['status'];
  lastOrderDate: string | null;
}

export function mapClientApiDto(dto: ClientApiDto): ClientContact {
  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    type: dto.type,
    email: dto.email ?? undefined,
    address: dto.address ?? undefined,
    notes: dto.notes ?? undefined,
    status: dto.status,
    lastOrderDate: dto.lastOrderDate ?? undefined,
  };
}
export interface ClientWriteDto {
  name?: ClientContact['name'];
  phone?: ClientContact['phone'];
  type?: ClientContact['type'];
  email?: ClientContact['email'];
  address?: ClientContact['address'];
  notes?: ClientContact['notes'];
  status?: ClientContact['status'];
  lastOrderDate?: ClientContact['lastOrderDate'];
}
function writePayload(input: Partial<ClientContact>): ClientWriteDto {
  if (input.id) requireRealId(input.id, 'cli');
  return {
    name: input.name,
    phone: input.phone,
    type: input.type,
    email: input.email,
    address: input.address,
    notes: input.notes,
    status: input.status,
    lastOrderDate: input.lastOrderDate,
  };
}

export async function getClientsApi(): Promise<ClientContact[]> {
  return (await apiRequest<ClientApiDto[]>('/clients', { cache: 'no-store' })).map(mapClientApiDto);
}
export async function getClientByIdApi(id: string): Promise<ClientContact> {
  requireRealId(id, 'cli');
  return mapClientApiDto(await apiRequest<ClientApiDto>(`/clients?id=${encodeURIComponent(id)}`, { cache: 'no-store' }));
}
export async function createClientApi(input: Omit<ClientContact, 'id'>): Promise<ClientContact> {
  return mapClientApiDto(await apiRequest<ClientApiDto>('/clients', { method: 'POST', body: JSON.stringify(writePayload(input)) }));
}
export async function updateClientApi(id: string, input: Partial<ClientContact>): Promise<ClientContact> {
  requireRealId(id, 'cli');
  return mapClientApiDto(await apiRequest<ClientApiDto>(`/clients?id=${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(writePayload(input)) }));
}
export async function deleteClientApi(id: string): Promise<void> {
  requireRealId(id, 'cli');
  await apiRequest(`/clients?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}
