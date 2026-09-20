# MEJUNJE — Data Ownership Registry

This registry establishes singular domain ownership over all database tables and entities across the MEJUNJE modular system (Agent 00-COR plus domain agents 01 through 11). Cross-domain access must use public contracts and integration requests governed by Master/Nexus.

---

## 1. Domain Ownership Matrix

| Domain / Agent | Primary Scope | Entities Owned |
| :--- | :--- | :--- |
| **00-COR (Core / Backend)** | Infrastructure, Identity & Audit | `customer_profiles` (auth/account profiles only), `staff_profiles`, `audit_logs`, RLS functions (`is_staff`, `is_admin`, `log_audit_event`), Supabase clients |
| **01-ECO (Ecommerce Storefront)** | Public Web UX & Client State | Cart state, session preferences, storefront UI presentation, client checkout payload generation |
| **02-CAT (Catalog)** | Product Portfolio & Pricing | `products`, `product_variants`, `prices`, `product_categories`, `olfactory_pyramids`, `catalog_media` |
| **03-CLI (Customers & CRM)** | Customer Master & Commercial CRM | `customer_entities`, `customer_addresses`, `crm_tags`, `crm_stages`, `rfm_metrics`, commercial history, guest customers |
| **04-PRV (Suppliers)** | Supplier Directory & Terms | `suppliers`, `supplier_contacts`, `supplier_price_lists`, `raw_material_sources` |
| **05-LAB (Laboratory)** | Formulations & R&D | `formulas`, `formula_versions`, `formula_ingredients`, `maceration_batches`, `lab_trials`, `sensory_notes` |
| **06-PRD (Production)** | Manufacturing & Assembly | `production_orders`, `batch_runs`, `quality_checks`, `packaging_logs` |
| **07-COM (Purchasing)** | Commercial Purchasing Lifecycle | `purchase_requisitions`, `purchase_orders`, `purchase_order_lines`, supplier delivery status, procurement terms |
| **08-INV (Inventory & Stock)** | Physical Stock Receipts & Movements | `inventory_items`, `inventory_receipts` (physical receipt posting), `stock_locations`, `stock_movements`, `stock_balances`, `lots`, `physical_counts`, `adjustments` |
| **09-MKT (Marketing)** | Campaigns & Growth | `coupons`, `marketing_campaigns`, `newsletter_subscribers`, `attribution_events` |
| **10-OBS (Market Observatory)** | Market Intelligence & Scraping | `competitor_products`, `competitor_prices`, `market_trends`, `benchmarking_snapshots` |
| **11-PED (Orders & Commerce)** | Authoritative Sales Orders & History | `sales_orders`, `sales_order_lines`, `order_snapshots`, `order_lifecycle_status`, `commercial_order_history`, `order_events` |

---

## 2. Key Boundary Clarifications

### A. Purchasing (07-COM) vs. Inventory (08-INV)
- **07-COM (Commercial Purchasing)**: Owns purchase requirements, requisitions, commercial purchase orders (POs), supplier delivery commitments, and purchasing status.
- **08-INV (Physical Stock Authority)**: Owns the authoritative physical stock receipt (`inventory_receipts`), inventory movements, lot tracking, stock adjustments, and warehouse balances. Purchasing records that a supplier delivery occurred; Inventory owns the resulting stock ledger effect.

### B. Ecommerce Storefront (01-ECO) vs. Orders (11-PED)
- **01-ECO (Client UX)**: Owns the client cart, checkout interaction, validation, and submission payload.
- **11-PED (Sales Orders)**: Owns the authoritative Sales Order created upon checkout completion, order lifecycle status transitions, order lines, line snapshots (preserving historical price and formulation attributes), and downstream order events consumed by marketing/inventory.

### C. Customer Identity: Core (00-COR) vs. Customers (03-CLI)
- **00-COR (`customer_profiles`)**: Minimal authentication profile linked 1:1 with `auth.users(id)`.
- **03-CLI (`customer_entities`)**: Complete commercial customer master supporting both registered customers and guest checkout buyers, multi-address books, CRM tags, and RFM scores.

---

## 3. Invariants

1. **Singular Authority**: Only the designated owner agent creates migrations affecting its tables.
2. **Read Access**: Modules requiring read access to another domain's data must utilize designated public foreign keys or read-only database views with explicit RLS rules.
3. **Write Protection**: No module agent may directly perform `INSERT`, `UPDATE`, or `DELETE` on another domain's private tables. All mutations require a public contract or workflow orchestrated via Master.
