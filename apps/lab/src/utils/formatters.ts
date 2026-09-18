/**
 * Utility functions for MEJUNJE Atelier
 */

/**
 * Format amounts using Argentine currency convention ($18.500)
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0';
  }
  return `$${Math.round(amount).toLocaleString('es-AR')}`;
}

/**
 * Format numbers with Argentine locale dots (1.000)
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return Number(num).toLocaleString('es-AR');
}
