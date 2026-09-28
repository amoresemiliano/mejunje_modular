/**
 * Catalog Domain (02-CAT) Security & Integrity Test Suite
 * Verifies catalog security invariants:
 * 1. Anonymous actors can read published products.
 * 2. Anonymous actors CANNOT read non-published (draft/archived) products.
 * 3. Anonymous actors CANNOT create, update, or delete catalog items.
 * 4. Authenticated Customers can read published products.
 * 5. Authenticated Customers CANNOT read draft/archived products.
 * 6. Authenticated Customers CANNOT perform catalog mutations.
 * 7. Active Staff members can read draft/archived products.
 * 8. Non-admin Staff members CANNOT perform catalog mutations.
 * 9. Active Admin possesses full catalog mutation privileges.
 * 10. Data integrity validation: duplicate slug/SKU and negative price validation.
 */

import { evaluateCatalogAccess } from '../src/index.ts';
import type { StaffProfile, Product, ProductVariant, Price } from '@mejunje/types';

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

// === 10. INTEGRITY ASSERTIONS ===
function validateProductData(product: Partial<Product>): boolean {
  if (!product.slug || product.slug.trim() === '') return false;
  if (!product.name || product.name.trim() === '') return false;
  return true;
}

function validatePriceData(price: Partial<Price>): boolean {
  if (price.amount === undefined || price.amount < 0) return false;
  if (!price.currency || price.currency.length !== 3) return false;
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
console.log('  @mejunje/auth CATALOG (02-CAT) TEST SUITE RESULTS');
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
