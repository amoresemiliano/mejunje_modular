<?php
/** Core business validation throws before any parent or child write. */
function businessRealId($id, string $prefix): void {
    if (!is_string($id) || !preg_match('/^' . preg_quote($prefix, '/') . '-[a-f0-9]{16}$/D', $id)) throw new InvalidArgumentException('A real server-generated ID is required.');
}
function businessNumber($value, string $field, bool $positive = false): float {
    if (!is_numeric($value) || !is_finite((float)$value) || ($positive ? (float)$value <= 0 : (float)$value < 0) || (float)$value >= 10000000000) throw new InvalidArgumentException("Invalid numeric field: $field.");
    $rounded = round((float)$value, 4);
    if ($positive && $rounded <= 0) throw new InvalidArgumentException("Field $field is below the supported precision.");
    return $rounded;
}
function businessRequired(array $data, array $fields): void {
    foreach ($fields as $field => $max) {
        if (!isset($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '' || strlen($data[$field]) > $max) throw new InvalidArgumentException("Invalid required field: $field.");
    }
}
function validateBusinessInput(string $entity, array $data): void {
    businessRequired($data, ['name'=>255]);
    if ($entity === 'clients') {
        businessRequired($data, ['phone'=>64,'type'=>64]);
        if (!empty($data['email']) && (!is_string($data['email']) || strlen($data['email']) > 255 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL))) throw new InvalidArgumentException('Invalid email.');
        if (!empty($data['lastOrderDate'])) {
            $date = is_string($data['lastOrderDate']) ? DateTime::createFromFormat('!Y-m-d',$data['lastOrderDate']) : false;
            if (!$date || $date->format('Y-m-d') !== $data['lastOrderDate']) throw new InvalidArgumentException('Invalid last order date.');
        }
        if (isset($data['status']) && !in_array($data['status'], ['Activo','Inactivo','Potencial'],true)) throw new InvalidArgumentException('Invalid client status.');
    } elseif ($entity === 'formulas') {
        businessRequired($data,['category'=>64,'yieldSize'=>128,'status'=>32,'version'=>64]);
        if (!in_array($data['status'],['Borrador','En prueba','Aprobada','Archivada'],true)) throw new InvalidArgumentException('Invalid formula status.');
        businessNumber($data['yieldUnits'] ?? 1,'yieldUnits',true);
        businessNumber($data['batchSizeGrams'] ?? null,'batchSizeGrams',true);
        if (businessNumber($data['suggestedMarginPercent'] ?? 65,'suggestedMarginPercent') > 999999) throw new InvalidArgumentException('Suggested markup is out of range.');
        foreach (['topNotes','heartNotes','baseNotes'] as $key) if (isset($data[$key]) && (!is_array($data[$key]) || count(array_filter($data[$key], 'is_string')) !== count($data[$key]))) throw new InvalidArgumentException('Notes must be arrays of strings.');
        foreach (['processMaxMeltingTemp','processFragranceTemp','processPouringTemp','processCuringDays'] as $key) if (isset($data[$key])) businessNumber($data[$key],$key);
        if (isset($data['processCuringDays']) && ((float)$data['processCuringDays'] != (int)$data['processCuringDays'] || (float)$data['processCuringDays'] > 2147483647)) throw new InvalidArgumentException('Curing days must be an integer.');
        if (!isset($data['ingredients']) || !is_array($data['ingredients'])) throw new InvalidArgumentException('Ingredients are required.');
    } else {
        businessRequired($data,['sku'=>128,'category'=>128,'status'=>32]);
        foreach (['description','shortDescription','collection','fragranceFamily'] as $key) if (!isset($data[$key]) || !is_string($data[$key])) throw new InvalidArgumentException("Field $key must be a string.");
        if (!in_array($data['status'], ['Borrador','Activo','Inactivo'],true)) throw new InvalidArgumentException('Invalid product status.');
        if (!isset($data['variants']) || !is_array($data['variants']) || !$data['variants']) throw new InvalidArgumentException('At least one variant is required.');
        if (isset($data['images']) && (!is_array($data['images']) || count(array_filter($data['images'],'is_string')) !== count($data['images']))) throw new InvalidArgumentException('Images must be strings.');
    }
    foreach (['email'=>255,'address'=>500,'notes'=>65535,'shortDescription'=>500,'collection'=>255,'fragranceFamily'=>255,'badge'=>255,'processNotes'=>65535] as $key=>$max) if (isset($data[$key]) && (!is_string($data[$key]) || strlen($data[$key]) > $max)) throw new InvalidArgumentException("Invalid field: $key.");
}
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

        foreach (['unit', 'purchaseUnit'] as $field) {
            if (array_key_exists($field, $data) && (!is_string($data[$field]) || !in_array($data[$field], ['g','kg','ml','l','unid'], true))) {
                $errors[] = "Unidad de compra/consumo no válida: $field.";
            }
        }
        if (!$isUpdate && !isset($data['purchaseUnit'])) $errors[] = 'La unidad de compra es obligatoria.';
        if (isset($data['unit'], $data['purchaseUnit'])) {
            try { convertIngredientQuantity(1, $data['purchaseUnit'], $data['unit']); }
            catch (InvalidArgumentException $e) { $errors[] = $e->getMessage(); }
        }
        foreach (['purchasePriceARS','referenceQty','stock','minStock'] as $field) {
            if (array_key_exists($field, $data)) {
                try { businessNumber($data[$field], $field, $field === 'referenceQty'); }
                catch (InvalidArgumentException $e) { $errors[] = $e->getMessage(); }
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

/** Convert only compatible stock dimensions; never infer density. */
function convertIngredientQuantity(float $quantity, string $from, string $to): float {
    $units = ['g'=>['mass',1], 'kg'=>['mass',1000], 'ml'=>['volume',1], 'l'=>['volume',1000], 'unid'=>['count',1]];
    if (!isset($units[$from], $units[$to]) || $units[$from][0] !== $units[$to][0]) {
        throw new InvalidArgumentException('Unidades de compra y consumo incompatibles.');
    }
    if (!is_finite($quantity) || $quantity <= 0) throw new InvalidArgumentException('La cantidad comprada debe ser mayor que cero.');
    $result = $quantity * $units[$from][1] / $units[$to][1];
    if (!is_finite($result) || $result <= 0) throw new InvalidArgumentException('Cantidad normalizada fuera de rango.');
    return $result;
}
/** Merge partial updates with persisted values before calculating authoritative cost. */
function ingredientUnitCost(array $input, array $existing = []): float {
    $price = businessNumber($input['purchasePriceARS'] ?? $existing['purchase_price_ars'] ?? 0, 'purchasePriceARS');
    $qty = businessNumber($input['referenceQty'] ?? $existing['reference_qty'] ?? null, 'referenceQty', true);
    $unit = $input['unit'] ?? $existing['unit'] ?? '';
    $purchaseUnit = $input['purchaseUnit'] ?? $existing['purchase_unit'] ?? $existing['unit'] ?? '';
    $normalized = convertIngredientQuantity($qty, $purchaseUnit, $unit);
    $cost = $price / $normalized;
    if (!is_finite($cost) || $cost >= 10000000000) throw new InvalidArgumentException('Costo unitario fuera de rango.');
    return round($cost, 4);
}
