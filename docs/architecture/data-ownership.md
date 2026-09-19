# MEJUNJE — Data Ownership Registry

This registry establishes singular domain ownership over all database tables and entities across the MEJUNJE modular system. Cross-domain access must use public contracts and integration requests governed by Master/Nexus.

---

## 1. Domain Ownership Matrix

| Domain / Agent | Primary Scope | Entities Owned |
| :--- | :--- | :--- |
| **00-COR (Core / Backend)** | Infrastructure, Identity & Audit | `customer_profiles`, `staff_profiles`, `audit_logs`, RLS functions (`is_staff`, `is_admin`), Supabase clients |
| **01-ECO (Ecommerce Storefront)** | Public Web UX & Client State | Cart state, session preferences, storefront UI presentation, client checkout payload generation |
| **02-CAT (Catalog)** | Product Portfolio & Pricing | `products`, `product_variants`, `prices`, `product_categories`, `olfactory_pyramids`, `catalog_media` |
| **03-CLI (Customers & CRM)** | Customer Business Profiles & CRM | `customer_entities`, `customer_addresses`, `crm_tags`, `crm_stages`, `rfm_metrics` |
| **04-PRV (Suppliers)** | Supplier Directory & Terms | `suppliers`, `supplier_contacts`, `supplier_price_lists`, `raw_material_sources` |
| **05-LAB (Laboratory)** | Formulations & R&D | `formulas`, `formula_versions`, `formula_ingredients`, `maceration_batches`, `lab_trials`, `sensory_notes` |
| **06-PRD (Production)** | Manufacturing & Assembly | `production_orders`, `batch_runs`, `quality_checks`, `packaging_logs` |
| **07-COM (Purchasing)** | Procurement & Reorders | `purchase_requisitions`, `purchase_orders`, `purchase_order_items`, `goods_receipts` |
| **08-INV (Inventory & Stock)** | Stock Levels & Movements | `inventory_items`, `stock_locations`, `stock_movements`, `lots`, `expiration_dates` |
| **09-MKT (Marketing)** | Campaigns & Growth | `coupons`, `marketing_campaigns`, `newsletter_subscribers`, `attribution_events` |
| **10-OBS (Market Observatory)** | Market Intelligence & Scraping | `competitor_products`, `competitor_prices`, `market_trends`, `benchmarking_snapshots` |

---

## 2. Invariants

1. **Singular Authority**: Only the designated owner agent creates migrations affecting its tables.
2. **Read Access**: Modules requiring read access to another domain's data must utilize designated public foreign keys or read-only database views with explicit RLS rules.
3. **Write Protection**: No module agent may directly perform `INSERT`, `UPDATE`, or `DELETE` on another domain's private tables. All mutations require a public contract or workflow orchestrated via Master.
