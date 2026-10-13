/** Demo fixtures never cross an operational API boundary. */
export function requireRealId(id: string, prefix: string): void {
  if (!new RegExp(`^${prefix}-[a-f0-9]{16}$`).test(id)) throw new Error('Only real API records can be changed.');
}
export function validateBusinessReferences(input: { ingredients?: { ingredientId: string }[]; formulaId?: string }): void {
  input.ingredients?.forEach(i => requireRealId(i.ingredientId, 'ing'));
  if (input.formulaId) requireRealId(input.formulaId, 'form');
}
