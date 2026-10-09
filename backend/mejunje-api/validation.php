<?php
/**
 * MEJUNJE Backoffice API - Validation & Utility Functions
 */

if (!function_exists('generateId')) {
    /**
     * Generate a server-side unique identifier.
     * Format: <prefix>-<16 char random hex> (e.g. sup-a1b2c3d4e5f67890)
     *
     * @param string $prefix ('sup' or 'ing')
     * @return string
     */
    function generateId(string $prefix): string {
        try {
            $bytes = random_bytes(8);
        } catch (\Exception $e) {
            $bytes = openssl_random_pseudo_bytes(8);
        }
        return strtolower($prefix) . '-' . bin2hex($bytes);
    }
}

if (!function_exists('validateSupplierInput')) {
    /**
     * Validate payload for Supplier creation/update.
     *
     * @param array $data
     * @param bool $isUpdate
     * @return array Array of error messages, empty if valid.
     */
    function validateSupplierInput(array $data, bool $isUpdate = false): array {
        $errors = [];

        if (!$isUpdate) {
            if (!isset($data['name']) || trim((string)$data['name']) === '') {
                $errors[] = "Field 'name' is required and cannot be empty.";
            }
        } else {
            if (array_key_exists('name', $data) && trim((string)$data['name']) === '') {
                $errors[] = "Field 'name' cannot be empty.";
            }
        }

        if (array_key_exists('email', $data) && $data['email'] !== null && trim((string)$data['email']) !== '') {
            $email = trim((string)$data['email']);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Field 'email' must be a valid email address.";
            }
        }

        if (array_key_exists('categoriesSupplied', $data) && $data['categoriesSupplied'] !== null) {
            if (!is_array($data['categoriesSupplied'])) {
                $errors[] = "Field 'categoriesSupplied' must be an array of strings.";
            } else {
                foreach ($data['categoriesSupplied'] as $cat) {
                    if (!is_string($cat)) {
                        $errors[] = "All elements in 'categoriesSupplied' must be strings.";
                        break;
                    }
                }
            }
        }

        if (array_key_exists('minPurchaseARS', $data) && $data['minPurchaseARS'] !== null) {
            if (!is_numeric($data['minPurchaseARS']) || (float)$data['minPurchaseARS'] < 0) {
                $errors[] = "Field 'minPurchaseARS' must be a numeric value greater than or equal to 0.";
            }
        }

        if (array_key_exists('deliveryTimeDays', $data) && $data['deliveryTimeDays'] !== null) {
            if (!is_numeric($data['deliveryTimeDays']) || (int)$data['deliveryTimeDays'] < 0) {
                $errors[] = "Field 'deliveryTimeDays' must be an integer value greater than or equal to 0.";
            }
        }

        return $errors;
    }
}

if (!function_exists('validateIngredientInput')) {
    /**
     * Validate payload for Ingredient creation/update.
     *
     * @param array $data
     * @param bool $isUpdate
     * @param PDO|null $pdo
     * @return array Array of error messages, empty if valid.
     */
    function validateIngredientInput(array $data, bool $isUpdate = false, ?PDO $pdo = null): array {
        $errors = [];

        if (!$isUpdate) {
            if (!isset($data['name']) || trim((string)$data['name']) === '') {
                $errors[] = "Field 'name' is required and cannot be empty.";
            }
            if (!isset($data['category']) || trim((string)$data['category']) === '') {
                $errors[] = "Field 'category' is required and cannot be empty.";
            }
            if (!isset($data['unit']) || trim((string)$data['unit']) === '') {
                $errors[] = "Field 'unit' is required and cannot be empty.";
            }
            if (!isset($data['referenceQty']) || !is_numeric($data['referenceQty']) || (float)$data['referenceQty'] <= 0) {
                $errors[] = "Field 'referenceQty' is required and must be a numeric value strictly greater than 0.";
            }
            if (isset($data['purchasePriceARS']) && (!is_numeric($data['purchasePriceARS']) || (float)$data['purchasePriceARS'] < 0)) {
                $errors[] = "Field 'purchasePriceARS' must be a numeric value greater than or equal to 0.";
            }
        } else {
            if (array_key_exists('name', $data) && trim((string)$data['name']) === '') {
                $errors[] = "Field 'name' cannot be empty.";
            }
            if (array_key_exists('category', $data) && trim((string)$data['category']) === '') {
                $errors[] = "Field 'category' cannot be empty.";
            }
            if (array_key_exists('unit', $data) && trim((string)$data['unit']) === '') {
                $errors[] = "Field 'unit' cannot be empty.";
            }
            if (array_key_exists('referenceQty', $data)) {
                if (!is_numeric($data['referenceQty']) || (float)$data['referenceQty'] <= 0) {
                    $errors[] = "Field 'referenceQty' must be a numeric value strictly greater than 0.";
                }
            }
            if (array_key_exists('purchasePriceARS', $data)) {
                if (!is_numeric($data['purchasePriceARS']) || (float)$data['purchasePriceARS'] < 0) {
                    $errors[] = "Field 'purchasePriceARS' must be a numeric value greater than or equal to 0.";
                }
            }
        }

        if (array_key_exists('stock', $data) && $data['stock'] !== null) {
            if (!is_numeric($data['stock']) || (float)$data['stock'] < 0) {
                $errors[] = "Field 'stock' must be a numeric value greater than or equal to 0.";
            }
        }

        if (array_key_exists('minStock', $data) && $data['minStock'] !== null) {
            if (!is_numeric($data['minStock']) || (float)$data['minStock'] < 0) {
                $errors[] = "Field 'minStock' must be a numeric value greater than or equal to 0.";
            }
        }

        // Validate active supplier existence if supplierId is provided
        if (array_key_exists('supplierId', $data) && $data['supplierId'] !== null && trim((string)$data['supplierId']) !== '') {
            $supplierId = trim((string)$data['supplierId']);
            if ($pdo !== null) {
                $stmt = $pdo->prepare("SELECT id FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
                $stmt->execute(['id' => $supplierId]);
                if (!$stmt->fetch()) {
                    $errors[] = "Supplier with ID '{$supplierId}' was not found or is inactive.";
                }
            }
        }

        return $errors;
    }
}

if (!function_exists('generatePoCode')) {
    /**
     * Generate human-readable PO code: OC-<YEAR>-<6 char uppercase hex>
     * e.g. OC-2026-A1B2C3
     *
     * @return string
     */
    function generatePoCode(): string {
        try {
            $bytes = random_bytes(3);
        } catch (\Exception $e) {
            $bytes = openssl_random_pseudo_bytes(3);
        }
        return 'OC-' . date('Y') . '-' . strtoupper(bin2hex($bytes));
    }
}

if (!function_exists('validatePurchaseOrderInput')) {
    /**
     * Validate payload for Purchase Order creation/update.
     *
     * @param array $data
     * @param bool $isUpdate
     * @param PDO|null $pdo
     * @return array Array of error messages, empty if valid.
     */
    function validatePurchaseOrderInput(array $data, bool $isUpdate = false, ?PDO $pdo = null): array {
        $errors = [];
        $validStatuses = ['Borrador', 'Pendiente', 'Solicitada', 'Confirmada', 'Recibida', 'Cancelada'];

        if (!$isUpdate) {
            if (!isset($data['supplierId']) || trim((string)$data['supplierId']) === '') {
                $errors[] = "Field 'supplierId' is required and cannot be empty.";
            } else if ($pdo !== null) {
                $supId = trim((string)$data['supplierId']);
                $stmt = $pdo->prepare("SELECT id FROM suppliers WHERE id = :id AND is_active = 1 LIMIT 1");
                $stmt->execute(['id' => $supId]);
                if (!$stmt->fetch()) {
                    $errors[] = "Supplier with ID '{$supId}' was not found or is inactive.";
                }
            }

            if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
                $errors[] = "Field 'items' is required and must contain at least one ingredient item.";
            } else if ($pdo !== null && isset($data['supplierId']) && trim((string)$data['supplierId']) !== '') {
                $supId = trim((string)$data['supplierId']);
                foreach ($data['items'] as $idx => $item) {
                    $itemNum = $idx + 1;
                    if (!isset($item['ingredientId']) || trim((string)$item['ingredientId']) === '') {
                        $errors[] = "Item #{$itemNum}: Field 'ingredientId' is required.";
                        continue;
                    }
                    $ingId = trim((string)$item['ingredientId']);
                    $stmt = $pdo->prepare("SELECT id, name, default_supplier_id FROM ingredients WHERE id = :id AND is_active = 1 LIMIT 1");
                    $stmt->execute(['id' => $ingId]);
                    $ingRow = $stmt->fetch();
                    if (!$ingRow) {
                        $errors[] = "Item #{$itemNum}: Ingredient with ID '{$ingId}' was not found or is inactive.";
                    } else if ($ingRow['default_supplier_id'] !== $supId) {
                        $ingName = $ingRow['name'];
                        $errors[] = "Item #{$itemNum}: Ingredient '{$ingName}' is unassigned or does not belong to the selected supplier.";
                    }

                    $qty = isset($item['requiredQty']) ? $item['requiredQty'] : ($item['orderedQty'] ?? ($item['quantity'] ?? null));
                    if ($qty === null || !is_numeric($qty) || (float)$qty <= 0) {
                        $errors[] = "Item #{$itemNum}: Quantity must be a numeric value strictly greater than 0.";
                    }

                    if (!isset($item['unitPriceARS']) || !is_numeric($item['unitPriceARS']) || (float)$item['unitPriceARS'] < 0) {
                        $errors[] = "Item #{$itemNum}: Unit price must be a numeric value greater than or equal to 0.";
                    }
                }
            }

            if (isset($data['status'])) {
                $statusStr = trim((string)$data['status']);
                if ($statusStr === 'Recibida') {
                    $errors[] = "Purchase Orders cannot be created directly with status 'Recibida'. Please create as 'Solicitada' or 'Confirmada' and transition to 'Recibida' upon stock arrival.";
                } else if (!in_array($statusStr, $validStatuses, true)) {
                    $errors[] = "Invalid status. Allowed values: " . implode(', ', $validStatuses);
                }
            }
        } else {
            if (array_key_exists('status', $data) && !in_array((string)$data['status'], $validStatuses, true)) {
                $errors[] = "Invalid status. Allowed values: " . implode(', ', $validStatuses);
            }
        }

        return $errors;
    }
}
