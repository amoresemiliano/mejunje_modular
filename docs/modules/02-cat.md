# MEJUNJE — 02-CAT Catalog Domain Specification

## 1. Module Purpose

`02-CAT (Catalog)` is the singular domain authority for MEJUNJE's commercial product portfolio. It owns the database definitions, validation rules, public accessibility policies, and pricing structures for all products offered commercially across storefronts and sales channels.

---

## 2. Entities Owned

The Catalog domain owns 7 core relational entities:

1. `public.products`: Master commercial product registry (`slug`, `name`, `description`, `status`).
2. `public.product_variants`: Sellable variants and SKUs (`sku`, `name`, `is_active`). Physical inventory is isolated in `08-INV`.
3. `public.prices`: Authority for current active commercial prices (`amount`, `currency`, `is_active`). Historical order snapshots are handled downstream in `11-PED`.
4. `public.product_categories`: Product taxonomy structure (`slug`, `name`, `parent_id`).
5. `public.product_category_mappings`: Many-to-many relationship mapping products to categories.
6. `public.olfactory_pyramids`: Commercial scent profile presentation (`top_notes`, `heart_notes`, `base_notes`). Internal R&D formulas are isolated in `05-LAB`.
7. `public.catalog_media`: Metadata for public catalog assets (`file_path`, `alt_text`, `display_order`, `is_primary`, `media_type`). Enforces target constraint `num_nonnulls(product_id, variant_id) = 1`. Binaries reside in the public `catalog-media` Supabase storage bucket.

---

## 3. Boundaries & Non-Ownership

`02-CAT` strictly respects system domain boundaries:

- **01-ECO (Storefront)**: ECO consumes public catalog contracts to present client UI, manage cart state, and drive checkout UX. CAT owns no UI components or client cart states.
- **05-LAB (Laboratory)**: LAB owns secret formulations, ingredient master lists, and maceration batches. CAT presents only public commercial olfactory pyramids (`top_notes`, `heart_notes`, `base_notes`).
- **08-INV (Inventory & Stock)**: INV owns physical stock balances, warehouse locations, and lot tracking. CAT variants contain SKUs but no stock levels or balances.
- **11-PED (Orders & Commerce)**: PED owns transactional order line items and historical price snapshots. CAT provides current active commercial prices; PED snapshots them at checkout time.

---

## 4. Pricing Model Architecture & Semantics

- **Active Commercial Price Authority**: `public.prices` maintains the live retail price per variant and currency.
- **Monetary Representation**: Prices utilize `numeric(12, 2)` (or fixed decimals) to prevent floating-point precision loss, with `amount >= 0`.
- **Currency Format Integrity**: Enforces PostgreSQL constraint `check (currency ~ '^[A-Z]{3}$')` validating uppercase 3-letter currency formats (`ARS`, `USD`).
- **Single-Price Constraint**: `unique (variant_id, currency)` guarantees a single price row per variant/currency combination (whether active or inactive), enforcing single-price authority for CAT V1 without price history tables.
- **Decoupling from Orders**: When a customer places an order, `11-PED` creates an immutable historical price snapshot on the order line. CAT price changes never retroactively modify completed sales orders.

---

## 5. Category Model Architecture

- Taxonomy is organized via `public.product_categories` supporting parent/child hierarchies (`parent_id`).
- Many-to-many mapping via `public.product_category_mappings` enables a product to belong to multiple commercial collections (e.g. "Velas", "Aromas de Estación", "Edición Limitada").

---

## 6. Olfactory Pyramid Model

- Commercial scent presentation is stored in `public.olfactory_pyramids` linked 1:1 with `products`.
- Uses Postgres array columns (`top_notes`, `heart_notes`, `base_notes`) for fast query retrieval and presentation.
- Completely isolated from internal chemical formulas in `05-LAB`.

---

## 7. Public Storage Bucket Strategy & Media Integrity

- **Public Bucket Strategy (Strategy A)**: The storage bucket `catalog-media` is public. It contains assets intended for public commercial exposure. Database RLS policies on `public.catalog_media` govern metadata SQL queries, but do not physically mask binary objects in a public bucket. Draft products or variants in the database may reference files in this public bucket.
- **Target Constraint**: Table `public.catalog_media` enforces `check (num_nonnulls(product_id, variant_id) = 1)`. Each media record must belong to exactly one `product_id` OR exactly one `variant_id`.
- **Strict Policy Resolution**: `catalog_media_select_policy` resolves public visibility as follows:
  - Media linked directly to `product_id`: Requires target product `status = 'published'`.
  - Media linked to `variant_id`: Resolves variant -> product and requires variant `is_active = true` AND parent product `status = 'published'`.
  - Unverified public access (such as `product_id IS NULL`) is strictly eliminated.

---

## 8. Row Level Security (RLS) & Access Policies

All tables enforce **Deny-by-Default** RLS:

- **VISITOR / Anonymous (`anon`)**:
  - `SELECT`: Allowed ONLY for published products (`status = 'published'`), active variants (`is_active = true`), active prices, public categories, and published media/pyramids.
  - `INSERT/UPDATE/DELETE`: Denied.

- **CUSTOMER / Authenticated (`authenticated`)**:
  - `SELECT`: Same as public visitor.
  - `INSERT/UPDATE/DELETE`: Denied.

- **STAFF (`public.is_staff() = true`)**:
  - `SELECT`: Allowed for draft, published, and archived catalog items.

- **ADMIN (`public.is_admin() = true`)**:
  - `INSERT/UPDATE/DELETE`: Full administrative mutation authority on all catalog entities.

---

## 9. Automatic Timestamp Maintenance (`updated_at`)

Reuses the Core helper function `public.set_updated_at()` via `BEFORE UPDATE` triggers on all 6 tables containing `updated_at`:
- `products`
- `product_variants`
- `prices`
- `product_categories`
- `olfactory_pyramids`
- `catalog_media`

---

## 10. Shared Public Contracts (`@mejunje/contracts`)

Domain `02-CAT` exposes stable DTO contracts for `@mejunje/storefront` and other consumers:

- `CatalogProductDTO`
- `CatalogVariantDTO`
- `CatalogPriceDTO`
- `CatalogCategoryDTO`
- `OlfactoryPyramidDTO`
- `CatalogMediaDTO`
- `CatalogProductDetailDTO`
