<?php
/**
 * MEJUNJE Backoffice API - Purchase Orders Endpoint
 *
 * Handles CRUD operations and Receiving workflow for Purchase Orders:
 * GET    /purchase-orders[.php]          - List active purchase orders with items
 * GET    /purchase-orders[.php]?id={id}  - Get single active purchase order with items
 * POST   /purchase-orders[.php]          - Create purchase order (calculates totals server-side)
 * PUT    /purchase-orders[.php]?id={id}  - Update status/observations (triggers atomic stock update when transitioning to 'Recibida')
 * DELETE /purchase-orders[.php]?id={id}  - Soft delete purchase order (is_active = 0, protects received orders)
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/validation.php';

/**
 * Convert DB purchase_orders row and items rows to API envelope format (camelCase).
 *
 * @param array $poRow
 * @param array $itemsRows
 * @return array
 */
function mapPurchaseOrderToApi(array $poRow, array $itemsRows): array {
    $items = array_map(function ($item) {
        return [
            'id'             => (string)$item['id'],
            'ingredientId'   => isset($item['ingredient_id']) && $item['ingredient_id'] !== null ? (string)$item['ingredient_id'] : null,
            'ingredientName' => (string)$item['ingredient_name'],
            'requiredQty'    => (float)$item['ordered_qty'],
            'unit'           => (string)$item['unit'],
            'unitPriceARS'   => (float)$item['unit_price_ars'],
            'subtotalARS'    => (float)$item['subtotal_ars']
        ];
    }, $itemsRows);

    return [
        'id'           => (string)$poRow['id'],
        'code'         => (string)$poRow['code'],
        'supplierId'   => isset($poRow['supplier_id']) && $poRow['supplier_id'] !== null ? (string)$poRow['supplier_id'] : '',
        'supplierName' => (string)$poRow['supplier_name'],
        'date'         => (string)$poRow['order_date'],
        'status'       => (string)$poRow['status'],
        'items'        => $items,
        'subtotalARS'  => (float)$poRow['subtotal_ars'],
        'totalARS'     => (float)$poRow['total_ars'],
        'observations' => isset($poRow['observations']) && $poRow['observations'] !== null ? (string)$poRow['observations'] : null,
        'receivedAt'   => isset($poRow['received_at']) && $poRow['received_at'] !== null ? (string)$poRow['received_at'] : null,
        'isActive'     => (bool)$poRow['is_active'],
        'createdAt'    => (string)($poRow['created_at'] ?? ''),
        'updatedAt'    => (string)($poRow['updated_at'] ?? '')
    ];
}

$pdo = getDbConnection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Determine ID from URL parameter (e.g. ?id=po-123) or PATH_INFO if routed
$id = $_GET['id'] ?? null;
if (!$id && isset($_SERVER['PATH_INFO']) && preg_match('/^\/([^\/]+)$/', $_SERVER['PATH_INFO'], $matches)) {
    $id = urldecode($matches[1]);
}

switch ($method) {
    case 'GET':
        if ($id) {
            $sql = "SELECT * FROM purchase_orders WHERE id = :id AND is_active = 1 LIMIT 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            $poRow = $stmt->fetch();
            if (!$poRow) {
                sendError('NOT_FOUND', 'Purchase Order not found or inactive.', 404);
            }

            $itemsSql = "SELECT * FROM purchase_order_items WHERE purchase_order_id = :po_id ORDER BY id ASC";
            $itemsStmt = $pdo->prepare($itemsSql);
            $itemsStmt->execute(['po_id' => $id]);
            $itemsRows = $itemsStmt->fetchAll();

            sendSuccess(mapPurchaseOrderToApi($poRow, $itemsRows));
        } else {
            $sql = "SELECT * FROM purchase_orders WHERE is_active = 1 ORDER BY created_at DESC";
            $stmt = $pdo->query($sql);
            $poRows = $stmt->fetchAll();

            $data = [];
            foreach ($poRows as $poRow) {
                $itemsSql = "SELECT * FROM purchase_order_items WHERE purchase_order_id = :po_id ORDER BY id ASC";
                $itemsStmt = $pdo->prepare($itemsSql);
                $itemsStmt->execute(['po_id' => $poRow['id']]);
                $itemsRows = $itemsStmt->fetchAll();

                $data[] = mapPurchaseOrderToApi($poRow, $itemsRows);
            }

            sendSuccess($data);
        }
        break;

    case 'POST':
        $input = getRequestJson();
        $errors = validatePurchaseOrderInput($input, false, $pdo);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $supplierId = trim((string)$input['supplierId']);

        // Fetch supplier snapshot
        $supStmt = $pdo->prepare("SELECT name FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
        $supStmt->execute(['id' => $supplierId]);
        $supRow = $supStmt->fetch();
        if (!$supRow) {
            sendError('VALIDATION_ERROR', 'Selected supplier not found or inactive.', 400);
        }
        $supplierName = $supRow['name'];

        $newPoId = generateId('po');
        $code = generatePoCode();
        $orderDate = isset($input['date']) && trim((string)$input['date']) !== '' ? trim((string)$input['date']) : date('Y-m-d');
        $status = isset($input['status']) && trim((string)$input['status']) !== '' ? trim((string)$input['status']) : 'Solicitada';
        $observations = isset($input['observations']) && trim((string)$input['observations']) !== '' ? trim((string)$input['observations']) : null;

        $pdo->beginTransaction();
        try {
            $totalArs = 0.00;
            $compiledItems = [];

            foreach ($input['items'] as $item) {
                $ingId = trim((string)$item['ingredientId']);

                $ingStmt = $pdo->prepare("SELECT name, unit FROM ingredients WHERE id = :id AND is_active = 1 LIMIT 1");
                $ingStmt->execute(['id' => $ingId]);
                $ingRow = $ingStmt->fetch();
                if (!$ingRow) {
                    throw new Exception("Ingredient ID '{$ingId}' not found or inactive.");
                }

                $qty = isset($item['requiredQty']) ? (float)$item['requiredQty'] : (float)($item['orderedQty'] ?? ($item['quantity'] ?? 0));
                $unitPrice = (float)$item['unitPriceARS'];
                $subtotal = round($qty * $unitPrice, 2);
                $totalArs += $subtotal;

                $poiId = generateId('poi');
                $compiledItems[] = [
                    'id'               => $poiId,
                    'purchaseOrder_id' => $newPoId,
                    'ingredient_id'   => $ingId,
                    'ingredient_name' => $ingRow['name'],
                    'unit'             => $ingRow['unit'],
                    'ordered_qty'      => $qty,
                    'unit_price_ars'  => $unitPrice,
                    'subtotal_ars'    => $subtotal,
                ];
            }

            $poSql = "INSERT INTO purchase_orders (
                        id, code, supplier_id, supplier_name, order_date, status,
                        subtotal_ars, total_ars, observations, received_at, is_active
                      ) VALUES (
                        :id, :code, :supplier_id, :supplier_name, :order_date, :status,
                        :subtotal_ars, :total_ars, :observations, NULL, 1
                      )";
            $poStmt = $pdo->prepare($poSql);
            $poStmt->execute([
                'id'            => $newPoId,
                'code'          => $code,
                'supplier_id'   => $supplierId,
                'supplier_name' => $supplierName,
                'order_date'    => $orderDate,
                'status'        => $status,
                'subtotal_ars'  => $totalArs,
                'total_ars'     => $totalArs,
                'observations'  => $observations
            ]);

            $poiSql = "INSERT INTO purchase_order_items (
                        id, purchase_order_id, ingredient_id, ingredient_name, unit,
                        ordered_qty, unit_price_ars, subtotal_ars
                       ) VALUES (
                        :id, :purchase_order_id, :ingredient_id, :ingredient_name, :unit,
                        :ordered_qty, :unit_price_ars, :subtotal_ars
                       )";
            $poiStmt = $pdo->prepare($poiSql);

            foreach ($compiledItems as $cItem) {
                $poiStmt->execute([
                    'id'                => $cItem['id'],
                    'purchase_order_id' => $cItem['purchaseOrder_id'],
                    'ingredient_id'    => $cItem['ingredient_id'],
                    'ingredient_name'  => $cItem['ingredient_name'],
                    'unit'              => $cItem['unit'],
                    'ordered_qty'       => $cItem['ordered_qty'],
                    'unit_price_ars'   => $cItem['unit_price_ars'],
                    'subtotal_ars'     => $cItem['subtotal_ars']
                ]);
            }

            $pdo->commit();

            // Fetch newly created PO
            $fetchPoStmt = $pdo->prepare("SELECT * FROM purchase_orders WHERE id = :id LIMIT 1");
            $fetchPoStmt->execute(['id' => $newPoId]);
            $createdPo = $fetchPoStmt->fetch();

            $fetchPoiStmt = $pdo->prepare("SELECT * FROM purchase_order_items WHERE purchase_order_id = :po_id ORDER BY id ASC");
            $fetchPoiStmt->execute(['po_id' => $newPoId]);
            $createdItems = $fetchPoiStmt->fetchAll();

            sendSuccess(mapPurchaseOrderToApi($createdPo, $createdItems), 201);
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendError('SERVER_ERROR', 'Failed to create Purchase Order: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
    case 'PATCH':
        $input = getRequestJson();
        $targetId = $id ?: ($input['id'] ?? null);

        if (!$targetId) {
            sendError('VALIDATION_ERROR', 'Purchase Order ID is required for update.', 400);
        }

        $errors = validatePurchaseOrderInput($input, true, $pdo);
        if (!empty($errors)) {
            sendError('VALIDATION_ERROR', implode(' ', $errors), 400);
        }

        $pdo->beginTransaction();
        try {
            $lockStmt = $pdo->prepare("SELECT * FROM purchase_orders WHERE id = :id AND is_active = 1 FOR UPDATE");
            $lockStmt->execute(['id' => $targetId]);
            $existingPo = $lockStmt->fetch();

            if (!$existingPo) {
                $pdo->rollBack();
                sendError('NOT_FOUND', 'Purchase Order not found or inactive.', 404);
            }

            $currentStatus = (string)$existingPo['status'];
            $currentReceivedAt = $existingPo['received_at'];

            $newStatus = array_key_exists('status', $input) ? trim((string)$input['status']) : $currentStatus;

            // STATUS REVERSAL PROTECTION
            if (($currentStatus === 'Recibida' || $currentReceivedAt !== null) && $newStatus !== 'Recibida') {
                $pdo->rollBack();
                sendError('VALIDATION_ERROR', 'Cannot reverse or modify status of a received Purchase Order.', 400);
            }

            // ATOMIC RECEIVING & STOCK INCREMENT WORKFLOW
            $newReceivedAt = $currentReceivedAt;
            if ($newStatus === 'Recibida' && $currentStatus !== 'Recibida' && $currentReceivedAt === null) {
                $itemsStmt = $pdo->prepare("SELECT ingredient_id, ingredient_name, ordered_qty FROM purchase_order_items WHERE purchase_order_id = :po_id");
                $itemsStmt->execute(['po_id' => $targetId]);
                $itemsToReceive = $itemsStmt->fetchAll();

                // PASS 1: Lock & verify every linked ingredient exists and is active
                foreach ($itemsToReceive as $itemRec) {
                    if ($itemRec['ingredient_id'] !== null) {
                        $ingId = $itemRec['ingredient_id'];
                        $ingLockStmt = $pdo->prepare("SELECT id, name, is_active FROM ingredients WHERE id = :ing_id FOR UPDATE");
                        $ingLockStmt->execute(['ing_id' => $ingId]);
                        $ingRow = $ingLockStmt->fetch();

                        if (!$ingRow || (int)$ingRow['is_active'] !== 1) {
                            $ingName = !empty($itemRec['ingredient_name']) ? $itemRec['ingredient_name'] : ($ingRow['name'] ?? $ingId);
                            $pdo->rollBack();
                            sendError('VALIDATION_ERROR', "Cannot receive Purchase Order: linked ingredient '{$ingName}' is missing or inactive.", 400);
                        }
                    }
                }

                // PASS 2: Perform stock increments and verify rowCount === 1
                foreach ($itemsToReceive as $itemRec) {
                    if ($itemRec['ingredient_id'] !== null) {
                        $stockStmt = $pdo->prepare("UPDATE ingredients SET stock = stock + :qty WHERE id = :ing_id AND is_active = 1");
                        $stockStmt->execute([
                            'qty'    => (float)$itemRec['ordered_qty'],
                            'ing_id' => $itemRec['ingredient_id']
                        ]);

                        if ($stockStmt->rowCount() !== 1) {
                            throw new RuntimeException("Failed to update stock for ingredient ID '{$itemRec['ingredient_id']}'.");
                        }
                    }
                }

                $newReceivedAt = date('Y-m-d H:i:s');
            }

            $newObservations = array_key_exists('observations', $input) ? (trim((string)$input['observations']) !== '' ? trim((string)$input['observations']) : null) : $existingPo['observations'];

            $updateSql = "UPDATE purchase_orders SET
                            status = :status,
                            observations = :observations,
                            received_at = :received_at,
                            updated_at = NOW()
                          WHERE id = :id";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([
                'status'       => $newStatus,
                'observations' => $newObservations,
                'received_at'  => $newReceivedAt,
                'id'           => $targetId
            ]);

            $pdo->commit();

            // Fetch updated order & items
            $fetchPoStmt = $pdo->prepare("SELECT * FROM purchase_orders WHERE id = :id LIMIT 1");
            $fetchPoStmt->execute(['id' => $targetId]);
            $updatedPo = $fetchPoStmt->fetch();

            $fetchPoiStmt = $pdo->prepare("SELECT * FROM purchase_order_items WHERE purchase_order_id = :po_id ORDER BY id ASC");
            $fetchPoiStmt->execute(['po_id' => $targetId]);
            $updatedItems = $fetchPoiStmt->fetchAll();

            sendSuccess(mapPurchaseOrderToApi($updatedPo, $updatedItems));
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            sendError('SERVER_ERROR', 'Failed to update Purchase Order: ' . $e->getMessage(), 500);
        }
        break;

    case 'DELETE':
        if (!$id) {
            sendError('VALIDATION_ERROR', 'Purchase Order ID parameter is required for deletion.', 400);
        }

        $stmt = $pdo->prepare("SELECT id, status, received_at FROM purchase_orders WHERE id = :id AND is_active = 1 LIMIT 1");
        $stmt->execute(['id' => $id]);
        $existingPo = $stmt->fetch();

        if (!$existingPo) {
            sendError('NOT_FOUND', 'Purchase Order not found or inactive.', 404);
        }

        // SOFT DELETE PROTECTION: Reject soft-deleting a received PO
        if ((string)$existingPo['status'] === 'Recibida' || $existingPo['received_at'] !== null) {
            sendError('VALIDATION_ERROR', 'Cannot delete a received Purchase Order.', 400);
        }

        $delStmt = $pdo->prepare("UPDATE purchase_orders SET is_active = 0, updated_at = NOW() WHERE id = :id");
        $delStmt->execute(['id' => $id]);

        sendSuccess([
            'id'      => $id,
            'deleted' => true,
            'message' => 'Purchase Order soft deleted successfully.'
        ]);
        break;

    default:
        sendError('METHOD_NOT_ALLOWED', "HTTP method {$method} is not supported on this endpoint.", 405);
        break;
}
