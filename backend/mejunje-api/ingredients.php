<?php
/**
 * MEJUNJE Backoffice API - Ingredients Endpoint
 *
 * Handles CRUD operations for Ingredients:
 * GET    /ingredients[.php]          - List active ingredients (joined with supplier name)
 * GET    /ingredients[.php]?id={id}  - Get single active ingredient
 * POST   /ingredients[.php]          - Create new ingredient (calculates unitCostARS server-side)
 * PUT    /ingredients[.php]?id={id}  - Update ingredient (recalculates unitCostARS if price/qty changes)
 * DELETE /ingredients[.php]?id={id}  - Soft delete ingredient (is_active = 0)
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/validation.php';

/**
 * Convert a DB ingredients row (snake_case + joined supplier_name) to API envelope format (camelCase).
 *
 * @param array $row
 * @return array
 */
function mapIngredientToApi(array $row): array {
    return [
        'id'               => (string)$row['id'],
        'name'             => (string)$row['name'],
        'category'         => (string)$row['category'],
        'unit'             => (string)$row['unit'],
        'purchasePriceARS' => isset($row['purchase_price_ars']) ? (float)$row['purchase_price_ars'] : 0.0,
        'referenceQty'     => isset($row['reference_qty']) ? (float)$row['reference_qty'] : 1.0,
        'unitCostARS'      => isset($row['unit_cost_ars']) ? (float)$row['unit_cost_ars'] : 0.0,
        'stock'            => isset($row['stock']) ? (float)$row['stock'] : 0.0,
        'minStock'         => isset($row['min_stock']) ? (float)$row['min_stock'] : 0.0,
        'supplierId'       => isset($row['default_supplier_id']) && $row['default_supplier_id'] !== null ? (string)$row['default_supplier_id'] : null,
        'supplierName'     => isset($row['supplier_name']) && $row['supplier_name'] !== null ? (string)$row['supplier_name'] : null,
        'imageUrl'         => isset($row['image_url']) && $row['image_url'] !== null ? (string)$row['image_url'] : null,
        'isActive'         => (bool)$row['is_active'],
        'createdAt'        => (string)($row['created_at'] ?? ''),
        'updatedAt'        => (string)($row['updated_at'] ?? '')
    ];
}

$pdo = getDbConnection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Determine ID from URL parameter (e.g. ?id=ing-123) or PATH_INFO if routed
$id = $_GET['id'] ?? null;
if (!$id && isset($_SERVER['PATH_INFO']) && preg_match('/^\/([^\/]+)$/', $_SERVER['PATH_INFO'], $matches)) {
    $id = urldecode($matches[1]);
}

switch ($method) {
    case 'GET':
        if ($id) {
            $sql = "SELECT i.*, s.name AS supplier_name 
                    FROM ingredients i 
                    LEFT JOIN suppliers s ON i.default_supplier_id = s.id 
                    WHERE i.id = :id AND i.is_active = 1 
                    LIMIT 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                sendError('NOT_FOUND', 'Ingredient not found or inactive.', 404);
            }
            sendSuccess(mapIngredientToApi($row));
        } else {
            $sql = "SELECT i.*, s.name AS supplier_name 
                    FROM ingredients i 
                    LEFT JOIN suppliers s ON i.default_supplier_id = s.id 
                    WHERE i.is_active = 1 
                    ORDER BY i.name ASC";
            $stmt = $pdo->query($sql);
            $rows = $stmt->fetchAll();
            $data = array_map('mapIngredientToApi', $rows);
            sendSuccess($data);
        }
        break;

    case 'POST':
        $input = getRequestJson();
        $errors = validateIngredientInput($input, false, $pdo);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $newId = generateId('ing');
        $name = trim((string)$input['name']);
        $category = trim((string)$input['category']);
        $unit = trim((string)$input['unit']);
        $purchasePriceARS = isset($input['purchasePriceARS']) ? (float)$input['purchasePriceARS'] : 0.00;
        $referenceQty = (float)$input['referenceQty'];

        // SERVER-SIDE unitCostARS CALCULATION
        $unitCostARS = round($purchasePriceARS / $referenceQty, 4);

        $stock = isset($input['stock']) ? (float)$input['stock'] : 0.0000;
        $minStock = isset($input['minStock']) ? (float)$input['minStock'] : 0.0000;
        $supplierId = isset($input['supplierId']) && trim((string)$input['supplierId']) !== '' ? trim((string)$input['supplierId']) : null;
        $imageUrl = isset($input['imageUrl']) && trim((string)$input['imageUrl']) !== '' ? trim((string)$input['imageUrl']) : null;

        $sql = "INSERT INTO ingredients (
                    id, name, category, unit, purchase_price_ars, reference_qty, unit_cost_ars,
                    stock, min_stock, default_supplier_id, image_url, is_active
                ) VALUES (
                    :id, :name, :category, :unit, :purchase_price_ars, :reference_qty, :unit_cost_ars,
                    :stock, :min_stock, :default_supplier_id, :image_url, 1
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id'                  => $newId,
            'name'                => $name,
            'category'            => $category,
            'unit'                => $unit,
            'purchase_price_ars'  => $purchasePriceARS,
            'reference_qty'       => $referenceQty,
            'unit_cost_ars'       => $unitCostARS,
            'stock'               => $stock,
            'min_stock'           => $minStock,
            'default_supplier_id' => $supplierId,
            'image_url'           => $imageUrl
        ]);

        // Fetch inserted record with joined supplier name
        $fetchSql = "SELECT i.*, s.name AS supplier_name 
                     FROM ingredients i 
                     LEFT JOIN suppliers s ON i.default_supplier_id = s.id 
                     WHERE i.id = :id LIMIT 1";
        $fetchStmt = $pdo->prepare($fetchSql);
        $fetchStmt->execute(['id' => $newId]);
        $createdRow = $fetchStmt->fetch();

        sendSuccess(mapIngredientToApi($createdRow), 201);
        break;

    case 'PUT':
    case 'PATCH':
        $input = getRequestJson();
        $targetId = $id ?: ($input['id'] ?? null);

        if (!$targetId) {
            sendError('VALIDATION_ERROR', 'Ingredient ID is required for update.', 400);
        }

        // Fetch current active record
        $checkStmt = $pdo->prepare("SELECT * FROM ingredients WHERE id = :id AND is_active = 1 LIMIT 1");
        $checkStmt->execute(['id' => $targetId]);
        $existing = $checkStmt->fetch();
        if (!$existing) {
            sendError('NOT_FOUND', 'Ingredient not found or inactive.', 404);
        }

        $errors = validateIngredientInput($input, true, $pdo);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $updates = [];
        $params = ['id' => $targetId];

        if (array_key_exists('name', $input)) {
            $updates[] = 'name = :name';
            $params['name'] = trim((string)$input['name']);
        }
        if (array_key_exists('category', $input)) {
            $updates[] = 'category = :category';
            $params['category'] = trim((string)$input['category']);
        }
        if (array_key_exists('unit', $input)) {
            $updates[] = 'unit = :unit';
            $params['unit'] = trim((string)$input['unit']);
        }
        if (array_key_exists('purchasePriceARS', $input)) {
            $updates[] = 'purchase_price_ars = :purchase_price_ars';
            $params['purchase_price_ars'] = (float)$input['purchasePriceARS'];
        }
        if (array_key_exists('referenceQty', $input)) {
            $updates[] = 'reference_qty = :reference_qty';
            $params['reference_qty'] = (float)$input['referenceQty'];
        }

        // Recalculate unit_cost_ars if price or referenceQty changed or updated
        $newPurchasePrice = array_key_exists('purchasePriceARS', $input)
            ? (float)$input['purchasePriceARS']
            : (float)$existing['purchase_price_ars'];

        $newRefQty = array_key_exists('referenceQty', $input)
            ? (float)$input['referenceQty']
            : (float)$existing['reference_qty'];

        $unitCostARS = round($newPurchasePrice / $newRefQty, 4);
        $updates[] = 'unit_cost_ars = :unit_cost_ars';
        $params['unit_cost_ars'] = $unitCostARS;

        if (array_key_exists('stock', $input)) {
            $updates[] = 'stock = :stock';
            $params['stock'] = (float)$input['stock'];
        }
        if (array_key_exists('minStock', $input)) {
            $updates[] = 'min_stock = :min_stock';
            $params['min_stock'] = (float)$input['minStock'];
        }
        if (array_key_exists('supplierId', $input)) {
            $updates[] = 'default_supplier_id = :default_supplier_id';
            $params['default_supplier_id'] = $input['supplierId'] !== null && trim((string)$input['supplierId']) !== ''
                ? trim((string)$input['supplierId'])
                : null;
        }
        if (array_key_exists('imageUrl', $input)) {
            $updates[] = 'image_url = :image_url';
            $params['image_url'] = $input['imageUrl'] !== null && trim((string)$input['imageUrl']) !== ''
                ? trim((string)$input['imageUrl'])
                : null;
        }

        if (!empty($updates)) {
            $sql = "UPDATE ingredients SET " . implode(', ', $updates) . " WHERE id = :id AND is_active = 1";
            $updateStmt = $pdo->prepare($sql);
            $updateStmt->execute($params);
        }

        $fetchSql = "SELECT i.*, s.name AS supplier_name 
                     FROM ingredients i 
                     LEFT JOIN suppliers s ON i.default_supplier_id = s.id 
                     WHERE i.id = :id LIMIT 1";
        $fetchStmt = $pdo->prepare($fetchSql);
        $fetchStmt->execute(['id' => $targetId]);
        $updatedRow = $fetchStmt->fetch();

        sendSuccess(mapIngredientToApi($updatedRow), 200);
        break;

    case 'DELETE':
        $input = getRequestJson();
        $targetId = $id ?: ($input['id'] ?? null);

        if (!$targetId) {
            sendError('VALIDATION_ERROR', 'Ingredient ID is required for deletion.', 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM ingredients WHERE id = :id AND is_active = 1 LIMIT 1");
        $checkStmt->execute(['id' => $targetId]);
        if (!$checkStmt->fetch()) {
            sendError('NOT_FOUND', 'Ingredient not found or inactive.', 404);
        }

        $deleteStmt = $pdo->prepare("UPDATE ingredients SET is_active = 0 WHERE id = :id");
        $deleteStmt->execute(['id' => $targetId]);

        sendSuccess([
            'id'      => (string)$targetId,
            'deleted' => true,
            'message' => 'Ingredient soft deleted successfully.'
        ], 200);
        break;

    default:
        sendError('METHOD_NOT_ALLOWED', "HTTP method '{$method}' is not allowed.", 405);
        break;
}
