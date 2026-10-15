import { StockUnit } from '@/types';
export const stockUnits: StockUnit[] = ['g','kg','ml','l','unid'];
const units = { g: ['mass',1], kg: ['mass',1000], ml: ['volume',1], l: ['volume',1000], unid: ['count',1] } as const;
export function ingredientCostPreview(price: number, quantity: number, purchase: string, consumption: string): number | null {
  if (!isStockUnit(purchase) || !isStockUnit(consumption)) return null;
  const from = units[purchase], to = units[consumption];
  if (from[0] !== to[0] || !Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity <= 0) return null;
  const cost = price / (quantity * from[1] / to[1]);
  return Number.isFinite(cost) ? cost : null;
}
export function isStockUnit(value: string): value is StockUnit { return stockUnits.some(unit => unit === value); }
