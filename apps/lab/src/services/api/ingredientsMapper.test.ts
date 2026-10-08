/**
 * Ingredient API Mapper Unit Tests
 */
import { mapIngredientApiDto, IngredientApiDto } from './ingredients';

export function testIngredientMapper() {
  // Scenario 1: Null supplierId, null supplierName, null imageUrl
  const nullDto: IngredientApiDto = {
    id: 'ing-test-1',
    name: 'Cera de Coco Botánica',
    category: 'Ceras',
    unit: 'kg',
    purchasePriceARS: 95000,
    referenceQty: 10,
    unitCostARS: 9500,
    stock: 50,
    minStock: 10,
    supplierId: null,
    supplierName: null,
    imageUrl: null,
    isActive: true,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-08T14:00:00Z',
  };

  const result1 = mapIngredientApiDto(nullDto);

  if (result1.supplierId !== '') {
    throw new Error(`Expected supplierId to be empty string, got '${result1.supplierId}'`);
  }
  if (result1.supplierName !== '') {
    throw new Error(`Expected supplierName to be empty string, got '${result1.supplierName}'`);
  }
  if (result1.imageUrl !== undefined) {
    throw new Error(`Expected imageUrl to be undefined, got '${result1.imageUrl}'`);
  }
  if (result1.lastUpdated !== '2026-10-08T14:00:00Z') {
    throw new Error(`Expected lastUpdated to be updatedAt '2026-10-08T14:00:00Z', got '${result1.lastUpdated}'`);
  }

  // Scenario 2: Fallback to createdAt when updatedAt is empty string
  const fallbackDto: IngredientApiDto = {
    ...nullDto,
    updatedAt: '',
    supplierId: 'sup-123',
    supplierName: 'Proveedor San Telmo',
  };

  const result2 = mapIngredientApiDto(fallbackDto);

  if (result2.supplierId !== 'sup-123') {
    throw new Error(`Expected supplierId 'sup-123', got '${result2.supplierId}'`);
  }
  if (result2.supplierName !== 'Proveedor San Telmo') {
    throw new Error(`Expected supplierName 'Proveedor San Telmo', got '${result2.supplierName}'`);
  }
  if (result2.lastUpdated !== '2026-10-01T08:00:00Z') {
    throw new Error(`Expected lastUpdated to fallback to createdAt '2026-10-01T08:00:00Z', got '${result2.lastUpdated}'`);
  }

  return true;
}

// Auto-run verification when executed directly via Node
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('ingredientsMapper.test')) {
  try {
    testIngredientMapper();
    console.log('✓ ingredientsMapper.test.ts PASSED (supplierName null-safety & lastUpdated derivation verified)');
  } catch (err: any) {
    console.error('✗ ingredientsMapper.test.ts FAILED:', err.message);
    process.exit(1);
  }
}
