# MEJUNJE — 01-ECO Storefront Domain Specification

## 1. Module Purpose

`01-ECO (Ecommerce Storefront)` owns the public web presentation, client interaction UX, cart state management, and client payload generation for MEJUNJE.

`01-ECO` is strictly a presentation and interaction domain. It does NOT own backend product catalog tables, inventory ledgers, customer CRM records, or order snapshot history.

---

## 2. Boundaries & Data Ownership

- **02-CAT (Catalog Authority)**: CAT owns all catalog database entities (`products`, `product_variants`, `prices`, `product_categories`, `olfactory_pyramids`, `catalog_media`). ECO queries CAT data via public contracts (`@mejunje/contracts`) and public Supabase client endpoints.
- **11-PED (Sales Orders)**: PED owns sales order creation and historical price snapshots. ECO submits validated client cart payloads to PED at checkout.
- **08-INV (Inventory & Stock)**: INV owns physical stock balances and warehouse locations. ECO displays stock availability indicators based on published contracts.

---

## 3. Catalog Integration Architecture

Storefront interacts with Catalog persistence using a strict 3-tier boundary:

```
┌──────────────────────────────────────┐
│       02-CAT Database Schema         │
│ (products, variants, prices, etc.)   │
└──────────────────┬───────────────────┘
                   │ Supabase Public Anon Client (RLS Enforced)
                   ▼
┌──────────────────────────────────────┐
│  Data Access Layer & Mapper          │
│ (apps/storefront/services/catalog)   │
└──────────────────┬───────────────────┘
                   │ Public DTO Contracts (@mejunje/contracts)
                   ▼
┌──────────────────────────────────────┐
│     Storefront UI Components          │
│  (Tienda, ProductDetailPage, Cards)  │
└──────────────────────────────────────┘
```

---

## 4. Key Security & Operational Invariants

1. **Public Anon Credentials Only**: Storefront connects to Supabase exclusively via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `service_role` keys are strictly prohibited.
2. **Read-Only Catalog Access**: Storefront performs `SELECT` queries for published products (`status = 'published'`). Storefront never executes `INSERT`, `UPDATE`, or `DELETE` on catalog tables.
3. **Storage Asset URLs**: Media URLs for `catalog-media` public storage bucket are constructed dynamically via Supabase storage helpers without hardcoding project URLs.
4. **Quiet Error Handling**: Database connection failures or unconfigured environments are handled gracefully, returning clean empty states without leaking internal database tracebacks to end users.
