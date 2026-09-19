# MEJUNJE — Backend Foundation Architecture (V1)

## 1. Executive Summary

This document specifies the core backend and database foundation for MEJUNJE. It defines the shared identity model, authorization invariants, Row Level Security (RLS) standards, audit logging, Supabase storage guidelines, and migration governance.

All domain module agents (Catalog, Customers, Suppliers, Laboratory, Production, Purchases, Inventory, Marketing, Observatory, Ecommerce) build their persistence layers upon this foundation.

---

## 2. Tenancy Decision

MEJUNJE operates as a **single unified brand and business entity**.
- **No multi-tenancy overhead**: Organizations, holdings, and tenant isolation layers are omitted to prevent premature complexity.
- **Future-Proof**: All primary keys utilize standard version-4 UUIDs, ensuring that if organizational scoping is ever required in future phases, entity relationships remain structurally clean.

---

## 3. Identity Model & Separation of Actors

MEJUNJE distinguishes three fundamental actors:

1. **VISITOR**:
   - Public anonymous user browsing the storefront or taking the olfactory quiz.
   - Requires no account.
2. **CUSTOMER**:
   - Registered ecommerce buyer with an account in `auth.users` and a corresponding profile in `public.customer_profiles`.
   - Has access to future `/cuenta`, order history, and saved preferences.
   - **CRITICAL INVARIANT**: A registered customer possesses **ZERO** privileges to internal `/lab` resources.
   - **SCOPE CLARIFICATION**: `public.customer_profiles` is Core-owned account/authentication infrastructure. Full commercial CRM data (guest customers, addresses, CRM tags, RFM metrics) is owned by Agent 03-CLI.
3. **STAFF**:
   - Internal MEJUNJE personnel (Lab technicians, Managers, Administrators).
   - Profile stored in `public.staff_profiles` with a designated role (`admin`, `manager`, `staff`) and an explicit `is_active = true` flag.
   - Granted access to `/lab` and module operational data.

```
       ┌────────────────────────┐
       │   auth.users (Auth)    │
       └───────────┬────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌──────────────────┐ ┌──────────────────┐
│ customer_profiles│ │  staff_profiles  │
│ (Core Account)   │ │  (Internal ERP)  │
└────────┬─────────┘ └──────────────────┘
         │ (optional link)
         ▼
┌──────────────────┐
│ customer_entities│
│ (03-CLI CRM)     │
└──────────────────┘
```

---

## 4. Authorization & Staff Privilege Escalation Protection

Staff authorization is strictly server-enforceable via Supabase Row Level Security (RLS), PostgreSQL triggers, and helper functions (`SECURITY DEFINER`):

- `public.is_staff()`: Returns `true` if `auth.uid()` belongs to an active staff member.
- `public.is_admin()`: Returns `true` if `auth.uid()` belongs to an active staff member with `role = 'admin'`.
- `public.get_staff_role()`: Returns the role string (`'admin'`, `'manager'`, `'staff'`).

### Security Definer Hardening Decisions
- All security functions explicitly declare `set search_path = public` to prevent search_path injection attacks.
- Execution grants are revoked from `PUBLIC` and selectively granted to `authenticated` and `anon`.
- **Privilege Escalation Guard**: Trigger `trigger_staff_profiles_update_guard` rejects any update from non-admin actors that attempts to modify `role`, `permissions`, `is_active`, `email`, or `id`.

---

## 5. Row Level Security (RLS) Conventions

1. **Deny-by-Default**: Every table must have `alter table <name> enable row level security;` enabled in its initial migration.
2. **No Permissive Placeholders**: Policies like `USING (true)` on private tables are strictly prohibited.
3. **Authoritative Server Verification**: Frontend visibility is considered UX only; database RLS policies and trigger guards enforce true data boundaries.
4. **Immutable Audit Trail**: `audit_logs` allows insert from authenticated actors but prohibits update and delete across all roles.

---

## 6. Audit Logging & Integrity Hardening

The `public.audit_logs` table provides a unified, tamper-resistant trail for critical events:

- `actor_id`: UUID referencing `auth.users(id)` (authoritatively derived from `auth.uid()` via trigger).
- `actor_type`: `'visitor' | 'customer' | 'staff' | 'system'` (authoritatively coerced server-side to prevent client forgery of staff/system credentials).
- `action`: Canonical action verb (e.g., `auth.login`, `catalog.price_change`, `formula.update`).
- `entity_type`: Target entity name (e.g., `product`, `formula_version`, `staff_profile`).
- `entity_id`: Identifier of the affected record.
- `metadata`: JSONB payload containing contextual details (diffs, IP, user-agent).

---

## 7. Storage Strategy

- **Bucket Naming**: Lowercase hyphenated namespaces (e.g., `catalog-media`, `lab-attachments`).
- **Public vs Private**:
  - `catalog-media`: Public read access for product imagery, assets, and scent cards.
  - `lab-attachments`: Private access restricted to active staff (`is_staff() = true`).
- **File Organization**: Deterministic prefix paths (e.g., `products/{product_id}/{filename}`).

---

## 8. Migration Governance

All database evolutions must adhere to:
1. Versioned sequential files under `supabase/migrations/YYYYMMDDHHMMSS_<description>.sql`.
2. Idempotent DDL statements (`create table if not exists`, `create index if not exists`).
3. Zero manual out-of-band schema changes in staging/production.
4. Non-destructive migration patterns for zero-downtime rollouts.
