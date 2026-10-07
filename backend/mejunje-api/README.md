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
   - `unitCostARS = round(purchasePriceARS / referenceQty, 4)`
   - Calculated automatically upon ingredient creation and recalculated upon update whenever `purchasePriceARS` or `referenceQty` is modified.
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
