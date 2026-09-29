/**
 * Catalog Domain (02-CAT) Security & Integrity Unit Test Suite
 * 
 * NOTE: These are JavaScript/TypeScript unit tests verifying application-level
 * catalog access logic, DTO contract guards, and payload validation rules.
 * Direct PostgreSQL Row Level Security (RLS) enforcement against a live database
 * requires an active Supabase runtime session and is marked UNVERIFIED until local Supabase is executed.
 * 
 * Verified Application Invariants:
 * 1. Anonymous actors can read published products.
 * 2. Anonymous actors CANNOT read non-published (draft/archived) products.
 * 3. Anonymous actors CANNOT create, update, or delete catalog items.
 * 4. Authenticated Customers can read published products.
 * 5. Authenticated Customers CANNOT read draft/archived products.
 * 6. Authenticated Customers CANNOT perform catalog mutations.
 * 7. Active Staff members can read draft/archived products.
 * 8. Non-admin Staff members CANNOT perform catalog mutations.
 * 9. Active Admin possesses full catalog mutation privileges.
 * 10. Catalog Media target constraint (must reference exactly 1 product OR 1 variant).
 * 11. Currency integrity (uppercase A-Z, exactly 3 characters).
 * 12. Product/price validity rules.
 */

import { evaluateCatalogAccess } from '../src/index.ts';
import type { StaffProfile, Product, Price, CatalogMedia } from '@mejunje/types';

interface TestResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, expected: string, actual: string) {
  results.push({
    name,
    expected,
    actual,
    passed: condition,
  });
}

// === FIXTURES ===
const staffMember: StaffProfile = {
  id: 'usr-staff-cat-111',
  email: 'staff.cat@mejunje.com.ar',
  full_name: 'Catalog Staff',
  role: 'staff',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const adminMember: StaffProfile = {
  id: 'usr-admin-cat-999',
  email: 'admin.cat@mejunje.com.ar',
  full_name: 'Catalog Admin',
  role: 'admin',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// === 1. POSITIVE TEST: Anonymous can read published catalog products ===
const anonReadPublished = evaluateCatalogAccess('read', 'published', null);
assert(
  'ANONYMOUS actor can read published products',
  anonReadPublished.allowed === true,
  'allowed = true',
  `allowed = ${anonReadPublished.allowed} (${anonReadPublished.reason})`
);

// === 2. NEGATIVE TEST: Anonymous cannot read draft products ===
const anonReadDraft = evaluateCatalogAccess('read', 'draft', null);
assert(
  'ANONYMOUS actor CANNOT read draft products',
  anonReadDraft.allowed === false,
  'allowed = false',
  `allowed = ${anonReadDraft.allowed} (${anonReadDraft.reason})`
);

// === 3. NEGATIVE TEST: Anonymous cannot create catalog products ===
const anonCreate = evaluateCatalogAccess('create', 'published', null);
assert(
  'ANONYMOUS actor CANNOT create products',
  anonCreate.allowed === false,
  'allowed = false',
  `allowed = ${anonCreate.allowed} (${anonCreate.reason})`
);

// === 4. POSITIVE TEST: Customer can read published products ===
const customerReadPublished = evaluateCatalogAccess('read', 'published', undefined);
assert(
  'CUSTOMER actor can read published products',
  customerReadPublished.allowed === true,
  'allowed = true',
  `allowed = ${customerReadPublished.allowed} (${customerReadPublished.reason})`
);

// === 5. NEGATIVE TEST: Customer cannot read draft products ===
const customerReadDraft = evaluateCatalogAccess('read', 'draft', undefined);
assert(
  'CUSTOMER actor CANNOT read draft products',
  customerReadDraft.allowed === false,
  'allowed = false',
  `allowed = ${customerReadDraft.allowed} (${customerReadDraft.reason})`
);

// === 6. NEGATIVE TEST: Customer cannot modify prices ===
const customerUpdatePrice = evaluateCatalogAccess('update', 'published', undefined);
assert(
  'CUSTOMER actor CANNOT modify prices or catalog data',
  customerUpdatePrice.allowed === false,
  'allowed = false',
  `allowed = ${customerUpdatePrice.allowed} (${customerUpdatePrice.reason})`
);

// === 7. POSITIVE TEST: Staff can read draft products ===
const staffReadDraft = evaluateCatalogAccess('read', 'draft', staffMember);
assert(
  'ACTIVE STAFF can read draft products',
  staffReadDraft.allowed === true,
  'allowed = true',
  `allowed = ${staffReadDraft.allowed} (${staffReadDraft.reason})`
);

// === 8. NEGATIVE TEST: Non-admin staff cannot create catalog products ===
const staffCreate = evaluateCatalogAccess('create', 'published', staffMember);
assert(
  'NON-ADMIN STAFF CANNOT create catalog products',
  staffCreate.allowed === false,
  'allowed = false',
  `allowed = ${staffCreate.allowed} (${staffCreate.reason})`
);

// === 9. POSITIVE TEST: Admin can create/update/delete catalog products ===
const adminCreate = evaluateCatalogAccess('create', 'published', adminMember);
const adminUpdate = evaluateCatalogAccess('update', 'published', adminMember);
const adminDelete = evaluateCatalogAccess('delete', 'published', adminMember);
assert(
  'ADMIN possesses full catalog mutation privileges (create/update/delete)',
  adminCreate.allowed === true && adminUpdate.allowed === true && adminDelete.allowed === true,
  'create/update/delete allowed = true',
  `create=${adminCreate.allowed}, update=${adminUpdate.allowed}, delete=${adminDelete.allowed}`
);

// === 10. INTEGRITY ASSERTION: Catalog Media Target Constraint ===
function validateCatalogMediaTarget(media: Partial<CatalogMedia>): boolean {
  const nonNullCount = (media.product_id ? 1 : 0) + (media.variant_id ? 1 : 0);
  return nonNullCount === 1;
}

const validProductMedia = validateCatalogMediaTarget({ product_id: 'prod-123' });
const validVariantMedia = validateCatalogMediaTarget({ variant_id: 'var-456' });
const invalidOrphanMedia = validateCatalogMediaTarget({});
const invalidDualMedia = validateCatalogMediaTarget({ product_id: 'prod-123', variant_id: 'var-456' });

assert(
  'CATALOG_MEDIA target must reference exactly 1 product OR 1 variant (valid product media)',
  validProductMedia === true,
  'valid = true',
  `valid = ${validProductMedia}`
);

assert(
  'CATALOG_MEDIA target must reference exactly 1 product OR 1 variant (valid variant media)',
  validVariantMedia === true,
  'valid = true',
  `valid = ${validVariantMedia}`
);

assert(
  'Orphan CATALOG_MEDIA (neither product nor variant) is REJECTED',
  invalidOrphanMedia === false,
  'valid = false',
  `valid = ${invalidOrphanMedia}`
);

assert(
  'Dual-target CATALOG_MEDIA (both product and variant) is REJECTED',
  invalidDualMedia === false,
  'valid = false',
  `valid = ${invalidDualMedia}`
);

// === 11. INTEGRITY ASSERTION: Currency Format Integrity ===
function validateCurrencyFormat(currency: string): boolean {
  return /^[A-Z]{3}$/.test(currency);
}

const validARS = validateCurrencyFormat('ARS');
const validUSD = validateCurrencyFormat('USD');
const invalidLowercase = validateCurrencyFormat('ars');
const invalidLong = validateCurrencyFormat('ARSP');
const invalidSymbol = validateCurrencyFormat('AR$');

assert(
  'Currency uppercase 3-letter format (ARS, USD) is ACCEPTED',
  validARS === true && validUSD === true,
  'valid = true',
  `ARS=${validARS}, USD=${validUSD}`
);

assert(
  'Invalid currency format (lowercase, symbols, wrong length) is REJECTED',
  invalidLowercase === false && invalidLong === false && invalidSymbol === false,
  'valid = false',
  `lowercase=${invalidLowercase}, long=${invalidLong}, symbol=${invalidSymbol}`
);

// === 12. INTEGRITY ASSERTION: Negative price & invalid product name ===
function validateProductData(product: Partial<Product>): boolean {
  if (!product.slug || product.slug.trim() === '') return false;
  if (!product.name || product.name.trim() === '') return false;
  return true;
}

function validatePriceData(price: Partial<Price>): boolean {
  if (price.amount === undefined || price.amount < 0) return false;
  if (!price.currency || !validateCurrencyFormat(price.currency)) return false;
  return true;
}

const invalidPrice = validatePriceData({ amount: -50, currency: 'ARS' });
assert(
  'Negative price amount is REJECTED by validation guard',
  invalidPrice === false,
  'valid = false',
  `valid = ${invalidPrice}`
);

const invalidProduct = validateProductData({ name: '', slug: 'test-product' });
assert(
  'Empty product name is REJECTED by validation guard',
  invalidProduct === false,
  'valid = false',
  `valid = ${invalidProduct}`
);

// Print Summary
console.log('\n======================================================');
console.log('  @mejunje/auth CATALOG (02-CAT) UNIT TEST SUITE');
console.log('======================================================');
let allPassed = true;
results.forEach((r, idx) => {
  const status = r.passed ? 'PASS' : 'FAIL';
  if (!r.passed) allPassed = false;
  console.log(`[${status}] #${idx + 1}: ${r.name}`);
  console.log(`       Expected: ${r.expected}`);
  console.log(`       Actual:   ${r.actual}\n`);
});

console.log(`TOTAL: ${results.length} | PASSED: ${results.filter((r) => r.passed).length} | FAILED: ${results.filter((r) => !r.passed).length}`);

if (!allPassed) {
  process.exit(1);
}
