# MEJUNJE Backoffice PHP REST API (DEV)

Canonical REST API for MEJUNJE Backoffice / ERP (`apps/lab`), written in plain PHP 7.4+ / 8.x with PDO.

---

## Architecture & Infrastructure

* **Backend Engine**: Apache / PHP (Percona Server 5.7.44-48 / MySQL 5.7)
* **Hosting**: BlueHost
* **DEV Web Path**: `/home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api`
* **Public DEV Base URL**: `https://vegendigital.com/sistemas/mejunje/dev/api`
* **Private DB Config File**: `/home3/athcomar/mejunje_api_config/dev.php` (OUTSIDE web root)
* **Target Database (DEV)**: `athcomar_mejunje_dev`

---

## File Structure

```text
backend/mejunje-api/
├── .htaccess            # Apache URL rewriting and HTTP routing
├── bootstrap.php        # CORS, response helpers, and PDO database bootstrap
├── config.example.php   # DB configuration template for private dev.php
├── health.php           # GET /health - Database connectivity check
├── ingredients.php      # CRUD endpoint for Ingredients vertical
├── response.php         # Standardized JSON response envelope & request decoding
├── suppliers.php        # CRUD endpoint for Suppliers vertical
├── validation.php      # Input validation & server-side ID generator
├── README.md            # Architecture & deployment documentation
└── tests/
    └── run_tests.php   # Automated local test runner
```

---

## Response Envelope & Error Codes

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'name' is required and cannot be empty."
  }
}
```

### Standardized Error Codes
* `VALIDATION_ERROR` (400) - Missing or invalid request parameters
* `INVALID_JSON` (400) - Malformed JSON payload
* `NOT_FOUND` / `SUPPLIER_NOT_FOUND` (404) - Resource not found or inactive
* `METHOD_NOT_ALLOWED` (405) - HTTP method not allowed
* `DB_ERROR` (500) - Database connection or execution failure (sensitive details hidden)
* `INTERNAL_ERROR` (500) - Internal server exception

---

## CORS Policy

Requests are restricted to explicit allowed origins:
* `https://www.mejunje.com.ar`
* `https://mejunje.com.ar`
* `http://localhost:3000` / `http://localhost:5173` (for local development)

`Access-Control-Allow-Origin: *` is **STRICTLY PROHIBITED**. Preflight `OPTIONS` requests are handled automatically with HTTP 204.

---

## Domain Rules & Calculations

1. **Server-Side Cost Calculation (`unitCostARS`)**:
   - `unitCostARS = round(purchasePriceARS / convert(referenceQty, purchaseUnit, unit), 4)`
   - Calculated automatically upon ingredient creation and recalculated upon update whenever `purchasePriceARS`, `referenceQty`, `purchaseUnit`, or `unit` is modified.
   - `referenceQty` must be strictly > 0.
2. **Server-Side ID Generation**:
   - Suppliers: `sup-<16 hex chars>` (e.g. `sup-40acfcd4a9cde345`)
   - Ingredients: `ing-<16 hex chars>` (e.g. `ing-72bd0edb65a9ca7d`)
3. **Soft Delete & Foreign Keys**:
   - Deletions set `is_active = 0`. Records are never physically deleted via normal API operations.
   - Because `ingredients.default_supplier_id` has `ON DELETE SET NULL`, soft-deleting a supplier does **NOT** alter the supplier ID on existing active ingredients. Active ingredients will continue to reference the soft-deleted supplier until reassigned.

---

## Deployment Deliverable & Instructions

To deploy the API to BlueHost DEV environment:

### Option A: Via SSH / rsync
```bash
rsync -avz --exclude="tests" --exclude="config.local.php" \
  backend/mejunje-api/ \
  athcomar@vegendigital.com:/home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/
```

### Option B: Manual File Transfer (cPanel File Manager or FTP)
1. Upload all files from `backend/mejunje-api/` to `/home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/`.
2. Ensure the private configuration exists at `/home3/athcomar/mejunje_api_config/dev.php` (outside web root).
3. Set permissions to `0644` for `.php` files and `0755` for directories.

---

## Smoke Test `curl` Commands

### 1. Health Endpoint
```bash
curl -i -X GET https://vegendigital.com/sistemas/mejunje/dev/api/health
```

### 2. Suppliers List
```bash
curl -i -X GET https://vegendigital.com/sistemas/mejunje/dev/api/suppliers
```

### 3. Supplier Create
```bash
curl -i -X POST https://vegendigital.com/sistemas/mejunje/dev/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fragancias Eissen AR",
    "contactPerson": "Esteban Eissen",
    "phoneWhatsApp": "+5491144445555",
    "email": "ventas@eissen.com.ar",
    "web": "https://eissen.com.ar",
    "location": "Buenos Aires",
    "categoriesSupplied": ["Fragancias", "Aditivos"],
    "minPurchaseARS": 120000,
    "deliveryTimeDays": 5
  }'
```

### 4. Ingredients List
```bash
curl -i -X GET https://vegendigital.com/sistemas/mejunje/dev/api/ingredients
```

### 5. Ingredient Create (with active supplier ID)
```bash
curl -i -X POST https://vegendigital.com/sistemas/mejunje/dev/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Esencia Lavanda Silvestre",
    "category": "Fragancias",
    "unit": "ml",
    "purchasePriceARS": 110000,
    "referenceQty": 1000,
    "stock": 2500,
    "minStock": 500,
    "supplierId": "sup-40acfcd4a9cde345"
  }'
```

### 6. Ingredient Update (recalculate cost)
```bash
curl -i -X PUT https://vegendigital.com/sistemas/mejunje/dev/api/ingredients?id=ing-72bd0edb65a9ca7d \
  -H "Content-Type: application/json" \
  -d '{
    "purchasePriceARS": 120000,
    "referenceQty": 1000
  }'
```

### 7. Soft Delete
```bash
curl -i -X DELETE https://vegendigital.com/sistemas/mejunje/dev/api/ingredients?id=ing-72bd0edb65a9ca7d
```


## WP-004: purchase units and image uploads (prepared, not deployed)

Migration 004 adds `purchase_unit`, backfills it from `unit`, and makes it NOT NULL on MySQL 5.7. It never changes historical costs or stock. `reference_qty` is the quantity bought for `purchase_price_ars`, in `purchase_unit`. `unit` remains the canonical consumption, formula and stock unit. Real creation requires both units; legacy DTOs fall back to `unit`. Legacy `%` records remain readable, but new stock units must be g/kg/ml/l/unid.

Mass g/kg, volume ml/l, and count unid convert within their dimension only. Example: ARS 42,500 / 5 kg = ARS 8.50/g when consumption is g. PUT/PATCH merges persisted fields before recalculation and ignores client unitCostARS. Unrelated partial edits preserve historical costs. Changing consumption unit requires existing stock/minimum to be zero and no open PO; otherwise it would reinterpret inventory. No implicit stock conversion is performed.

PO quantities and prices remain in the canonical consumption unit, including their stored unit snapshot. Enter 5000 g to order 5 kg when `unit=g`. Reception remains atomic and refuses mismatched snapshot/current units. No PO schema migration was added.

`POST /media` accepts multipart field `file`. Valid images are stored under API-local `uploads/images/`, returned as `/dev/api/uploads/images/img-<48 random hex>.<jpg|png|webp>`. Only the path is stored on business records. Files are not inserted into MySQL or JSON/base64. Images are optional; blank values become null, and the catalog uses a neutral local placeholder. Replacing/removing an image changes its record reference; orphan files are not deleted in V1.

Upload checks: is_uploaded_file, actual finfo MIME, getimagesize structure/MIME agreement, 8 MiB size limit, rejection of executable/polyglot content, controlled MIME extension, random_bytes filename, fixed contained directory without upload symlinks, directory 0755/file 0644. Apache rules deny other upload paths, disable execution/directory listing, and send nosniff. SVG and original filenames are never accepted for storage. PHP must have fileinfo enabled. GD is required only to generate fixtures in the local tests.

### Prepared DEV-only commands — NOT executed

From the repository root on a host with access to the DEV MySQL database:

```bash
read -r -p "DEV MySQL user: " DEV_DB_USER
mysql --host=localhost --user="$DEV_DB_USER" --password athcomar_mejunje_dev < database/migrations/004_add_ingredient_purchase_units.sql
```

The actual DB username is private and is not present in this repository. Back up DEV first; MySQL 5.7 DDL implicitly commits. Rollback removes purchase_unit only and must be paired with the previous application version; retain a backup of purchase units before rollback.

Exact changed backend deployment files, relative to `backend/mejunje-api/`, targeting `/home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/`:

- `.htaccess`
- `ingredients.php`
- `validation.php`
- `purchase-orders.php`
- `media.php`
- `media-validation.php`
- `uploads/.htaccess`

Do not upload tests, configuration, migration SQL, or local fixture files into the web root. Do not use a sync command that deletes existing uploads. Frontend changes require a separate authorized lab deployment after migration/backend setup.

BlueHost DEV upload directory setup, after transferring the protection rules:

```bash
mkdir -p /home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/uploads/images
chmod 0755 /home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/uploads /home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/uploads/images
chmod 0644 /home3/athcomar/public_html/vegendigital/sistemas/mejunje/dev/api/uploads/.htaccess
```

The directory must be owned/writable by the account running PHP; do not use 0777. Set PHP `upload_max_filesize=8M` and `post_max_size=10M` in the DEV PHP configuration/cPanel, and verify effective limits and Apache overrides. No BlueHost directory, setting, migration or deployment has been changed. BlueHost filesystem/PHP/Apache and Vercel multipart proxy compatibility remain unverified.

### Manual DEV validation after a separately authorized rollout

- Confirm migration backfill matches prior unit and historical costs/stock are unchanged.
- Open Nueva Entrada on desktop and mobile: Cliente, Proveedor, Insumo, Compra, Fórmula, Producto. Create each and reload to confirm API persistence.
- Create/edit Supplier, Ingredient and Product using upload and manual URL. Check preview, replacement, removal, loading and readable errors. Empty images must remain empty after reload; primary product image occurs once in images.
- Upload JPEG/PNG/WebP including misleading extensions; reject SVG, PHP, forged MIME, malformed image and >8 MiB. Load the returned canonical path through Vercel and check nosniff/non-executable storage.
- Verify 42500/5 kg→g=8.5, 120000/1 l→ml=120, 12000/100 unid→unid=120. Reject incompatible units, %, and zero quantity. Update each cost input independently and verify server result.
- For ingredient g purchased in kg, create PO with 5000 g and confirm receipt adds exactly 5000 g once. Verify invalid/mismatched units reject without stock changes.
- Confirm real forms do not select demo suppliers; demo fixtures remain read-only. Check formula/catalog costs from newly saved normalized ingredients.

### Local verification commands and limits

```bash
php -l backend/mejunje-api/media.php
php -l backend/mejunje-api/ingredients.php
php -l backend/mejunje-api/validation.php
php -l backend/mejunje-api/purchase-orders.php
php backend/mejunje-api/tests/run_tests.php
php backend/mejunje-api/tests/operational-ux.test.php
php backend/mejunje-api/tests/ingredient-units-endpoint.test.php
php backend/mejunje-api/tests/purchase_orders_integrity.php
node --test tests/business-api.test.cjs tests/operational-ux.test.cjs
npm run build --workspace=@mejunje/lab
```

Endpoint harnesses require PDO SQLite enabled in the PHP configuration inherited by child processes. They exercise local SQL; they do not verify MySQL DDL or lock contention. The separate existing `business-core.test.php` suite reproduces a pre-existing failure at line 114 (`subsequent edit retains cost snapshot and approved price`) with both this branch and the original main files under local PHP 8.1/SQLite. It is not repaired by WP-004. No deployed runtime verification is claimed.
