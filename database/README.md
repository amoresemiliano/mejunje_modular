# MEJUNJE Backoffice Database Migrations

This directory contains canonical database schema migrations for the **MEJUNJE Backoffice / ERP** (`apps/lab`).

---

## Architecture & Database Target

* **Database Engine**: BlueHost MySQL / Percona Server `5.7.44-48`
* **Collation & Character Set**: `utf8mb4_unicode_ci` / `utf8mb4`
* **Development Database (DEV)**: `athcomar_mejunje_dev`
* **Production Database (PROD)**: `athcomar_mejunje_prod`

> ⚠️ **IMPORTANT**: Supabase (`/supabase`) migrations and configuration files in this repository are **historical artifacts** from an earlier development thread and **MUST NOT** be used for MEJUNJE backoffice persistence.

---

## Migration Governance & Rules

1. **Versioned & Paired**: Every schema change must be a numbered `.sql` file in `database/migrations/` and MUST be paired with a matching `.rollback.sql` file.
2. **Execution Order**: Migrations are executed on **DEV first** (`athcomar_mejunje_dev`), verified against health/API endpoints, and then promoted to **PROD** (`athcomar_mejunje_prod`).
3. **Idempotency**: Use `CREATE TABLE IF NOT EXISTS` for creation scripts. Rollback scripts must drop tables in dependency-safe order (child tables before parent tables).
4. **No Direct Production Edits**: DDL statements must never be executed manually in production without a versioned script committed to the repository.

---

## Schema Design Decisions (V1 Vertical)

### 1. Cost Model (`unit_cost_ars`)
* **Decision**: `unit_cost_ars` is stored as `DECIMAL(12,4) NOT NULL DEFAULT 0.0000` and maintained explicitly by the backend PHP API upon write (`purchase_price_ars / reference_qty`).
* **Rationale**: Safer and more predictable across MySQL 5.7 versions than DB-level generated columns; prevents divide-by-zero SQL traps during draft inserts.

### 2. Supplier Categories (`categories_supplied`)
* **Decision**: `categories_supplied` uses native MySQL 5.7 `JSON` storage.
* **Rationale**: Direct 1:1 mapping with TypeScript `string[]` (`["Fragancias", "Aditivos"]`) without premature table normalization.

### 3. Category Field (`category`)
* **Decision**: `category` uses `VARCHAR(64)` indexed string storage.
* **Rationale**: Avoids MySQL `ENUM` rigidity, allowing new insumo categories to be added in application code or UI without altering MySQL schema.

### 4. Primary Key & Identifier Strategy
* **Decision**: Primary keys use `VARCHAR(64)` (e.g. `sup-*`, `ing-*`).
* **Rationale**: Preserves compatibility with existing synthetic IDs and client interfaces; identifiers are generated server-side by the PHP API prior to insertion.

---

## Migration Index

| Migration File | Description | Rollback File | Status |
| :--- | :--- | :--- | :--- |
| [`001_create_suppliers_and_ingredients.sql`](./migrations/001_create_suppliers_and_ingredients.sql) | Initial tables for Suppliers + Ingredients & 1:N foreign key relationship. | [`001_create_suppliers_and_ingredients.rollback.sql`](./migrations/001_create_suppliers_and_ingredients.rollback.sql) | **Pending DEV Apply** |
