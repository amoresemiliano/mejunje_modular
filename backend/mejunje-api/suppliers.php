<?php
/**
 * MEJUNJE Backoffice API - Suppliers Endpoint
 *
 * Handles CRUD operations for Suppliers:
 * GET    /suppliers[.php]          - List active suppliers
 * GET    /suppliers[.php]?id={id}  - Get single active supplier
 * POST   /suppliers[.php]          - Create new supplier
 * PUT    /suppliers[.php]?id={id}  - Update active supplier
 * DELETE /suppliers[.php]?id={id}  - Soft delete supplier (is_active = 0)
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/validation.php';

/**
 * Convert a DB suppliers row (snake_case) to API envelope format (camelCase).
 *
 * @param array $row
 * @return array
 */
function mapSupplierToApi(array $row): array {
    $categories = [];
    if (!empty($row['categories_supplied'])) {
        $decoded = is_string($row['categories_supplied'])
            ? json_decode($row['categories_supplied'], true)
            : $row['categories_supplied'];
        if (is_array($decoded)) {
            $categories = $decoded;
        }
    }

    return [
        'id'                 => (string)$row['id'],
        'name'               => (string)$row['name'],
        'contactPerson'      => (string)($row['contact_person'] ?? ''),
        'phoneWhatsApp'      => (string)($row['phone_whatsapp'] ?? ''),
        'email'              => isset($row['email']) && $row['email'] !== null ? (string)$row['email'] : null,
        'web'                => isset($row['web']) && $row['web'] !== null ? (string)$row['web'] : null,
        'location'           => isset($row['location']) && $row['location'] !== null ? (string)$row['location'] : null,
        'categoriesSupplied' => $categories,
        'minPurchaseARS'     => isset($row['min_purchase_ars']) ? (float)$row['min_purchase_ars'] : 0.0,
        'deliveryTimeDays'   => isset($row['delivery_time_days']) ? (int)$row['delivery_time_days'] : 0,
        'notes'              => isset($row['notes']) && $row['notes'] !== null ? (string)$row['notes'] : null,
        'imageUrl'           => isset($row['image_url']) && $row['image_url'] !== null ? (string)$row['image_url'] : null,
        'isActive'           => (bool)$row['is_active'],
        'createdAt'          => (string)($row['created_at'] ?? ''),
        'updatedAt'          => (string)($row['updated_at'] ?? '')
    ];
}

$pdo = getDbConnection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Determine ID from URL parameter (e.g. ?id=sup-123) or PATH_INFO if routed
$id = $_GET['id'] ?? null;
if (!$id && isset($_SERVER['PATH_INFO']) && preg_match('/^\/([^\/]+)$/', $_SERVER['PATH_INFO'], $matches)) {
    $id = urldecode($matches[1]);
}

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                sendError('SUPPLIER_NOT_FOUND', 'Supplier not found or inactive.', 404);
            }
            sendSuccess(mapSupplierToApi($row));
        } else {
            $stmt = $pdo->query("SELECT * FROM suppliers WHERE is_active = 1 ORDER BY name ASC");
            $rows = $stmt->fetchAll();
            $data = array_map('mapSupplierToApi', $rows);
            sendSuccess($data);
        }
        break;

    case 'POST':
        $input = getRequestJson();
        $errors = validateSupplierInput($input, false);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $newId = generateId('sup');
        $name = trim((string)$input['name']);
        $contactPerson = isset($input['contactPerson']) ? trim((string)$input['contactPerson']) : '';
        $phoneWhatsApp = isset($input['phoneWhatsApp']) ? trim((string)$input['phoneWhatsApp']) : '';
        $email = isset($input['email']) && trim((string)$input['email']) !== '' ? trim((string)$input['email']) : null;
        $web = isset($input['web']) && trim((string)$input['web']) !== '' ? trim((string)$input['web']) : null;
        $location = isset($input['location']) && trim((string)$input['location']) !== '' ? trim((string)$input['location']) : null;
        
        $categoriesJson = null;
        if (isset($input['categoriesSupplied']) && is_array($input['categoriesSupplied'])) {
            $categoriesJson = json_encode(array_values($input['categoriesSupplied']), JSON_UNESCAPED_UNICODE);
        }

        $minPurchaseARS = isset($input['minPurchaseARS']) ? (float)$input['minPurchaseARS'] : 0.00;
        $deliveryTimeDays = isset($input['deliveryTimeDays']) ? (int)$input['deliveryTimeDays'] : 0;
        $notes = isset($input['notes']) && trim((string)$input['notes']) !== '' ? trim((string)$input['notes']) : null;
        $imageUrl = isset($input['imageUrl']) && trim((string)$input['imageUrl']) !== '' ? trim((string)$input['imageUrl']) : null;

        $sql = "INSERT INTO suppliers (
                    id, name, contact_person, phone_whatsapp, email, web, location,
                    categories_supplied, min_purchase_ars, delivery_time_days, notes, image_url, is_active
                ) VALUES (
                    :id, :name, :contact_person, :phone_whatsapp, :email, :web, :location,
                    :categories_supplied, :min_purchase_ars, :delivery_time_days, :notes, :image_url, 1
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id'                  => $newId,
            'name'                => $name,
            'contact_person'      => $contactPerson,
            'phone_whatsapp'      => $phoneWhatsApp,
            'email'               => $email,
            'web'                 => $web,
            'location'            => $location,
            'categories_supplied' => $categoriesJson,
            'min_purchase_ars'    => $minPurchaseARS,
            'delivery_time_days'  => $deliveryTimeDays,
            'notes'               => $notes,
            'image_url'           => $imageUrl
        ]);

        $fetchStmt = $pdo->prepare("SELECT * FROM suppliers WHERE id = :id LIMIT 1");
        $fetchStmt->execute(['id' => $newId]);
        $createdRow = $fetchStmt->fetch();

        sendSuccess(mapSupplierToApi($createdRow), 201);
        break;

    case 'PUT':
    case 'PATCH':
        $input = getRequestJson();
        $targetId = $id ?: ($input['id'] ?? null);

        if (!$targetId) {
            sendError('VALIDATION_ERROR', 'Supplier ID is required for update.', 400);
        }

        // Check active supplier existence
        $checkStmt = $pdo->prepare("SELECT * FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
        $checkStmt->execute(['id' => $targetId]);
        $existing = $checkStmt->fetch();
        if (!$existing) {
            sendError('SUPPLIER_NOT_FOUND', 'Supplier not found or inactive.', 404);
        }

        $errors = validateSupplierInput($input, true);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $updates = [];
        $params = ['id' => $targetId];

        if (array_key_exists('name', $input)) {
            $updates[] = 'name = :name';
            $params['name'] = trim((string)$input['name']);
        }
        if (array_key_exists('contactPerson', $input)) {
            $updates[] = 'contact_person = :contact_person';
            $params['contact_person'] = trim((string)$input['contactPerson']);
        }
        if (array_key_exists('phoneWhatsApp', $input)) {
            $updates[] = 'phone_whatsapp = :phone_whatsapp';
            $params['phone_whatsapp'] = trim((string)$input['phoneWhatsApp']);
        }
        if (array_key_exists('email', $input)) {
            $updates[] = 'email = :email';
            $params['email'] = $input['email'] !== null && trim((string)$input['email']) !== '' ? trim((string)$input['email']) : null;
        }
        if (array_key_exists('web', $input)) {
            $updates[] = 'web = :web';
            $params['web'] = $input['web'] !== null && trim((string)$input['web']) !== '' ? trim((string)$input['web']) : null;
        }
        if (array_key_exists('location', $input)) {
            $updates[] = 'location = :location';
            $params['location'] = $input['location'] !== null && trim((string)$input['location']) !== '' ? trim((string)$input['location']) : null;
        }
        if (array_key_exists('categoriesSupplied', $input)) {
            $updates[] = 'categories_supplied = :categories_supplied';
            $params['categories_supplied'] = is_array($input['categoriesSupplied'])
                ? json_encode(array_values($input['categoriesSupplied']), JSON_UNESCAPED_UNICODE)
                : null;
        }
        if (array_key_exists('minPurchaseARS', $input)) {
            $updates[] = 'min_purchase_ars = :min_purchase_ars';
            $params['min_purchase_ars'] = (float)$input['minPurchaseARS'];
        }
        if (array_key_exists('deliveryTimeDays', $input)) {
            $updates[] = 'delivery_time_days = :delivery_time_days';
            $params['delivery_time_days'] = (int)$input['deliveryTimeDays'];
        }
        if (array_key_exists('notes', $input)) {
            $updates[] = 'notes = :notes';
            $params['notes'] = $input['notes'] !== null && trim((string)$input['notes']) !== '' ? trim((string)$input['notes']) : null;
        }
        if (array_key_exists('imageUrl', $input)) {
            $updates[] = 'image_url = :image_url';
            $params['image_url'] = $input['imageUrl'] !== null && trim((string)$input['imageUrl']) !== '' ? trim((string)$input['imageUrl']) : null;
        }

        if (!empty($updates)) {
            $sql = "UPDATE suppliers SET " . implode(', ', $updates) . " WHERE id = :id AND is_active = 1";
            $updateStmt = $pdo->prepare($sql);
            $updateStmt->execute($params);
        }

        $fetchStmt = $pdo->prepare("SELECT * FROM suppliers WHERE id = :id LIMIT 1");
        $fetchStmt->execute(['id' => $targetId]);
        $updatedRow = $fetchStmt->fetch();

        sendSuccess(mapSupplierToApi($updatedRow), 200);
        break;

    case 'DELETE':
        $input = getRequestJson();
        $targetId = $id ?: ($input['id'] ?? null);

        if (!$targetId) {
            sendError('VALIDATION_ERROR', 'Supplier ID is required for deletion.', 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
        $checkStmt->execute(['id' => $targetId]);
        if (!$checkStmt->fetch()) {
            sendError('SUPPLIER_NOT_FOUND', 'Supplier not found or inactive.', 404);
        }

        $deleteStmt = $pdo->prepare("UPDATE suppliers SET is_active = 0 WHERE id = :id");
        $deleteStmt->execute(['id' => $targetId]);

        sendSuccess([
            'id'      => (string)$targetId,
            'deleted' => true,
            'message' => 'Supplier soft deleted successfully.'
        ], 200);
        break;

    default:
        sendError('METHOD_NOT_ALLOWED', "HTTP method '{$method}' is not allowed.", 405);
        break;
}
