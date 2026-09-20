/**
 * Hardened Security Assertion Suite for @mejunje/auth
 * Verifies core security invariants:
 * 1. Anonymous actors cannot access staff resources (/lab).
 * 2. Authenticated Customers cannot access staff resources (/lab).
 * 3. Customer A cannot access Customer B private profile.
 * 4. Staff access is explicitly granted and verified.
 * 5. Unknown/unrecognized roles fail closed.
 * 6. Non-admin staff cannot escalate own role (staff -> admin) [STAFF ESCALATION GUARD].
 * 7. Non-admin staff cannot modify own permissions or active status [STAFF ESCALATION GUARD].
 * 8. Customer cannot forge a STAFF audit log entry [AUDIT INTEGRITY GUARD].
 * 9. Customer direct arbitrary audit INSERT is DENIED [AUDIT WRITE AUTHORITY GUARD].
 * 10. Controlled RPC audit write path is ACCEPTED [AUDIT WRITE AUTHORITY GUARD].
 */

import {
  hasStaffAccess,
  hasAdminAccess,
  evaluateCustomerAccess,
  evaluateLabAccess,
  evaluateStaffProfileUpdate,
  resolveAuthoritativeActorType,
  evaluateAuditWriteAuthority,
} from '../src/index.ts';
import type { CustomerProfile, StaffProfile } from '@mejunje/types';

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
const customerA: CustomerProfile = {
  id: 'usr-customer-aaa-1111',
  email: 'customer.a@mejunje.com.ar',
  full_name: 'Customer Alpha',
  phone: '+541112345678',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const customerB: CustomerProfile = {
  id: 'usr-customer-bbb-2222',
  email: 'customer.b@mejunje.com.ar',
  full_name: 'Customer Beta',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const staffMember: StaffProfile = {
  id: 'usr-staff-sss-3333',
  email: 'staff.member@mejunje.com.ar',
  full_name: 'Staff Member',
  role: 'staff',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const adminMember: StaffProfile = {
  id: 'usr-admin-xxx-9999',
  email: 'admin@mejunje.com.ar',
  full_name: 'Admin Boss',
  role: 'admin',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const inactiveStaff: StaffProfile = {
  id: 'usr-inactive-0000',
  email: 'fired.staff@mejunje.com.ar',
  full_name: 'Ex Staff',
  role: 'staff',
  is_active: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// === 1. NEGATIVE TEST: Anonymous cannot access /lab ===
const anonLab = evaluateLabAccess(null, null);
assert(
  'ANONYMOUS actor cannot access /lab',
  anonLab.allowed === false,
  'allowed = false',
  `allowed = ${anonLab.allowed} (${anonLab.reason})`
);

// === 2. NEGATIVE TEST: Customer without staff profile cannot access /lab ===
const customerLab = evaluateLabAccess(customerA.id, null);
assert(
  'CUSTOMER actor without staff profile cannot access /lab',
  customerLab.allowed === false,
  'allowed = false',
  `allowed = ${customerLab.allowed} (${customerLab.reason})`
);

// === 3. NEGATIVE TEST: Customer A cannot access Customer B private profile ===
const crossCustomer = evaluateCustomerAccess(customerA.id, customerB.id, null);
assert(
  'CUSTOMER A cannot access CUSTOMER B private profile',
  crossCustomer.allowed === false,
  'allowed = false',
  `allowed = ${crossCustomer.allowed} (${crossCustomer.reason})`
);

// === 4. POSITIVE TEST: Customer A can access Customer A private profile ===
const ownCustomer = evaluateCustomerAccess(customerA.id, customerA.id, null);
assert(
  'CUSTOMER A can access own private profile',
  ownCustomer.allowed === true,
  'allowed = true',
  `allowed = ${ownCustomer.allowed} (${ownCustomer.reason})`
);

// === 5. POSITIVE TEST: Active Staff can access /lab ===
const staffLab = evaluateLabAccess(staffMember.id, staffMember);
assert(
  'ACTIVE STAFF can access /lab',
  staffLab.allowed === true,
  'allowed = true',
  `allowed = ${staffLab.allowed} (${staffLab.reason})`
);

// === 6. POSITIVE TEST: Active Admin can access /lab and admin functions ===
const adminLab = evaluateLabAccess(adminMember.id, adminMember);
const adminCheck = hasAdminAccess(adminMember);
assert(
  'ADMIN possesses both staff and admin permissions',
  adminLab.allowed === true && adminCheck === true,
  'allowed = true, isAdmin = true',
  `allowed = ${adminLab.allowed}, isAdmin = ${adminCheck}`
);

// === 7. NEGATIVE TEST: Inactive Staff fails closed ===
const inactiveLab = evaluateLabAccess(inactiveStaff.id, inactiveStaff);
assert(
  'INACTIVE STAFF member is denied /lab access',
  inactiveLab.allowed === false,
  'allowed = false',
  `allowed = ${inactiveLab.allowed} (${inactiveLab.reason})`
);

// === 8. NEGATIVE TEST: Unrecognized/tampered role fails closed ===
const tamperedStaff = {
  ...staffMember,
  role: 'super_hacker' as any,
};
const tamperedLab = evaluateLabAccess(tamperedStaff.id, tamperedStaff);
assert(
  'UNRECOGNIZED role fails closed on /lab access',
  tamperedLab.allowed === false,
  'allowed = false',
  `allowed = ${tamperedLab.allowed} (${tamperedLab.reason})`
);

// === 9. HARDENING TEST: Staff attempting to escalate own role to admin ===
const escalateRoleAttempt = evaluateStaffProfileUpdate(staffMember, { role: 'admin' });
assert(
  'STAFF cannot escalate own role (staff -> admin)',
  escalateRoleAttempt.allowed === false,
  'allowed = false',
  `allowed = ${escalateRoleAttempt.allowed} (${escalateRoleAttempt.reason})`
);

// === 10. HARDENING TEST: Staff attempting to modify own permissions ===
const escalatePermsAttempt = evaluateStaffProfileUpdate(staffMember, { permissions: ['all:access'] });
assert(
  'STAFF cannot modify own permissions',
  escalatePermsAttempt.allowed === false,
  'allowed = false',
  `allowed = ${escalatePermsAttempt.allowed} (${escalatePermsAttempt.reason})`
);

// === 11. HARDENING TEST: Staff attempting to modify own is_active status ===
const escalateActiveAttempt = evaluateStaffProfileUpdate(staffMember, { is_active: false });
assert(
  'STAFF cannot modify own is_active status',
  escalateActiveAttempt.allowed === false,
  'allowed = false',
  `allowed = ${escalateActiveAttempt.allowed} (${escalateActiveAttempt.reason})`
);

// === 12. HARDENING TEST: Staff permitted benign self-edit (e.g. full_name) ===
const benignSelfEdit = evaluateStaffProfileUpdate(staffMember, { full_name: 'Updated Name' });
assert(
  'STAFF permitted benign self-profile update (full_name)',
  benignSelfEdit.allowed === true,
  'allowed = true',
  `allowed = ${benignSelfEdit.allowed} (${benignSelfEdit.reason})`
);

// === 13. HARDENING TEST: Admin can modify staff roles ===
const adminRoleUpdate = evaluateStaffProfileUpdate(adminMember, { role: 'manager' });
assert(
  'ADMIN can update staff role assignments',
  adminRoleUpdate.allowed === true,
  'allowed = true',
  `allowed = ${adminRoleUpdate.allowed} (${adminRoleUpdate.reason})`
);

// === 14. HARDENING TEST: Customer attempting to forge staff audit event ===
const forgedAuditEvent = resolveAuthoritativeActorType(customerA.id, 'staff', false);
assert(
  'CUSTOMER cannot forge STAFF audit event (coerced to customer)',
  forgedAuditEvent.effectiveActorType === 'customer' && forgedAuditEvent.wasOverridden === true,
  'effectiveActorType = customer, wasOverridden = true',
  `effectiveActorType = ${forgedAuditEvent.effectiveActorType}, wasOverridden = ${forgedAuditEvent.wasOverridden}`
);

// === 15. AUDIT WRITE AUTHORITY: Direct arbitrary client INSERT is DENIED ===
const directClientInsert = evaluateAuditWriteAuthority(true, false, {
  actorType: 'customer',
  action: 'tampered.action',
  entityType: 'catalog',
});
assert(
  'CUSTOMER direct arbitrary client INSERT into audit_logs is DENIED',
  directClientInsert.allowed === false,
  'allowed = false',
  `allowed = ${directClientInsert.allowed} (${directClientInsert.reason})`
);

// === 16. AUDIT WRITE AUTHORITY: Authorized audit write via RPC is ACCEPTED ===
const rpcAuditWrite = evaluateAuditWriteAuthority(false, true, {
  actorType: 'customer',
  action: 'customer.profile_updated',
  entityType: 'customer_profile',
});
assert(
  'Authorized audit write path via controlled RPC is ACCEPTED',
  rpcAuditWrite.allowed === true,
  'allowed = true',
  `allowed = ${rpcAuditWrite.allowed} (${rpcAuditWrite.reason})`
);

// Print summary
console.log('\n======================================================');
console.log('  @mejunje/auth HARDENED SECURITY TEST SUITE RESULTS');
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
