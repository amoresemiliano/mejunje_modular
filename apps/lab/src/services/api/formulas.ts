import { Formula } from '@/types';
import { apiRequest } from './client';
import { requireRealId, validateBusinessReferences } from './businessGuards';

export interface FormulaIngredientDto {
  ingredientId: string | null;
  ingredientName: string;
  category: string;
  quantity: number;
  unit: string;
  percentage: number;
  unitCostARS: number;
  supplierId: string | null;
  supplierName: string | null;
  calculatedCostARS: number;
}
export interface FormulaApiDto {
  id: string;
  name: string;
  category: Formula['category'];
  yieldSize: string;
  yieldUnits: number;
  batchSizeGrams: number;
  status: Formula['status'];
  version: string;
  notes: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  suggestedMarginPercent: number;
  processMaxMeltingTemp: number | null;
  processFragranceTemp: number | null;
  processPouringTemp: number | null;
  processCuringDays: number | null;
  processNotes: string | null;
  totalCostARS: number;
  unitCostARS: number;
  ingredients: FormulaIngredientDto[];
}

export function mapFormulaApiDto(dto: FormulaApiDto): Formula {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    yieldSize: dto.yieldSize,
    yieldUnits: Number(dto.yieldUnits),
    batchSizeGrams: Number(dto.batchSizeGrams),
    status: dto.status,
    version: dto.version,
    notes: dto.notes ?? undefined,
    topNotes: dto.topNotes,
    heartNotes: dto.heartNotes,
    baseNotes: dto.baseNotes,
    suggestedMarginPercent: Number(dto.suggestedMarginPercent),
    processMaxMeltingTemp: dto.processMaxMeltingTemp == null ? undefined : Number(dto.processMaxMeltingTemp),
    processFragranceTemp: dto.processFragranceTemp == null ? undefined : Number(dto.processFragranceTemp),
    processPouringTemp: dto.processPouringTemp == null ? undefined : Number(dto.processPouringTemp),
    processCuringDays: dto.processCuringDays == null ? undefined : Number(dto.processCuringDays),
    processNotes: dto.processNotes ?? undefined,
    totalCostARS: Number(dto.totalCostARS),
    unitCostARS: Number(dto.unitCostARS),
    ingredients: dto.ingredients.map(i => ({ ingredientId: i.ingredientId ?? "", ingredientName: i.ingredientName, category: i.category, quantity: Number(i.quantity), unit: i.unit, percentage: Number(i.percentage), unitCostARS: Number(i.unitCostARS), supplierId: i.supplierId ?? undefined, supplierName: i.supplierName ?? undefined, calculatedCostARS: Number(i.calculatedCostARS) })),
  };
}
export interface FormulaWriteDto {
  name?: Formula['name'];
  category?: Formula['category'];
  yieldSize?: Formula['yieldSize'];
  yieldUnits?: Formula['yieldUnits'];
  batchSizeGrams?: Formula['batchSizeGrams'];
  status?: Formula['status'];
  version?: Formula['version'];
  notes?: Formula['notes'];
  topNotes?: Formula['topNotes'];
  heartNotes?: Formula['heartNotes'];
  baseNotes?: Formula['baseNotes'];
  suggestedMarginPercent?: Formula['suggestedMarginPercent'];
  processMaxMeltingTemp?: Formula['processMaxMeltingTemp'];
  processFragranceTemp?: Formula['processFragranceTemp'];
  processPouringTemp?: Formula['processPouringTemp'];
  processCuringDays?: Formula['processCuringDays'];
  processNotes?: Formula['processNotes'];
  ingredients?: { ingredientId: string; quantity: number; percentage: number }[];
}
function writePayload(input: Partial<Formula>): FormulaWriteDto {
  if (input.id) requireRealId(input.id, 'form');
  return {
    name: input.name,
    category: input.category,
    yieldSize: input.yieldSize,
    yieldUnits: input.yieldUnits,
    batchSizeGrams: input.batchSizeGrams,
    status: input.status,
    version: input.version,
    notes: input.notes,
    topNotes: input.topNotes,
    heartNotes: input.heartNotes,
    baseNotes: input.baseNotes,
    suggestedMarginPercent: input.suggestedMarginPercent,
    processMaxMeltingTemp: input.processMaxMeltingTemp,
    processFragranceTemp: input.processFragranceTemp,
    processPouringTemp: input.processPouringTemp,
    processCuringDays: input.processCuringDays,
    processNotes: input.processNotes,
    ingredients: input.ingredients?.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity, percentage: i.percentage })),
  };
}

export async function getFormulasApi(): Promise<Formula[]> {
  return (await apiRequest<FormulaApiDto[]>('/formulas', { cache: 'no-store' })).map(mapFormulaApiDto);
}
export async function getFormulaByIdApi(id: string): Promise<Formula> {
  requireRealId(id, 'form');
  return mapFormulaApiDto(await apiRequest<FormulaApiDto>(`/formulas?id=${encodeURIComponent(id)}`, { cache: 'no-store' }));
}
export async function createFormulaApi(input: Omit<Formula, 'id'>): Promise<Formula> {
  validateBusinessReferences(input);
  return mapFormulaApiDto(await apiRequest<FormulaApiDto>('/formulas', { method: 'POST', body: JSON.stringify(writePayload(input)) }));
}
export async function updateFormulaApi(id: string, input: Partial<Formula>): Promise<Formula> {
  requireRealId(id, 'form'); validateBusinessReferences(input);
  return mapFormulaApiDto(await apiRequest<FormulaApiDto>(`/formulas?id=${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(writePayload(input)) }));
}
export async function deleteFormulaApi(id: string): Promise<void> {
  requireRealId(id, 'form');
  await apiRequest(`/formulas?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}
