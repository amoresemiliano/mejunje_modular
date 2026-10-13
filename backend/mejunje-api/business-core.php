<?php
/** Persistent core business records. All table/column names come from fixed schemas. */
require_once __DIR__ . '/validation.php';

function businessSchema(string $entity): array {
    $schemas = [
        'clients' => ['name','phone','type','email','address','notes','status','lastOrderDate'],
        'formulas' => ['name','category','yieldSize','yieldUnits','batchSizeGrams','status','version','notes','topNotes','heartNotes','baseNotes','suggestedMarginPercent','processMaxMeltingTemp','processFragranceTemp','processPouringTemp','processCuringDays','processNotes','totalCostARS','unitCostARS'],
        'catalog_products' => ['sku','name','category','description','shortDescription','collection','fragranceFamily','status','formulaId','formulaName','imageUrl','images','badge','topNotes','heartNotes','baseNotes'],
        'formula_ingredients' => ['formulaId','ingredientId','ingredientName','category','quantity','unit','percentage','unitCostARS','supplierId','supplierName','calculatedCostARS'],
        'product_variants' => ['productId','sku','size','unit','aroma','salePriceARS','estimatedCostARS','suggestedSalePriceARS','marginPercent','status'],
    ];
    return $schemas[$entity];
}

function businessColumn(string $field): string {
    return strtolower(preg_replace('/([a-z0-9])([A-Z])/', '$1_$2', $field));
}

function businessMap(string $entity, array $row): array {
    $result = ['id' => (string)$row['id']];
    $numbers = ['yieldUnits','batchSizeGrams','suggestedMarginPercent','processMaxMeltingTemp','processFragranceTemp','processPouringTemp','processCuringDays','totalCostARS','unitCostARS','quantity','percentage','calculatedCostARS','salePriceARS','estimatedCostARS','suggestedSalePriceARS','marginPercent'];
    foreach (businessSchema($entity) as $field) {
        $value = $row[businessColumn($field)] ?? null;
        if (in_array($field, $numbers, true) && $value !== null) $value = (float)$value;
        if (($entity === 'formulas' && in_array($field, ['topNotes','heartNotes','baseNotes'], true)) || $field === 'images') $value = $value === null ? [] : json_decode($value, true);
        $result[$field] = $value;
    }
    return $result;
}

function businessRead(PDO $pdo, string $entity, string $id, bool $lock = false): array {
    $stmt = $pdo->prepare("SELECT * FROM $entity WHERE id = ? AND is_active = 1" . ($lock ? ' FOR UPDATE' : ''));
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) throw new OutOfBoundsException('Record not found or inactive.');
    $data = businessMap($entity, $row);
    if ($entity !== 'clients') {
        $child = $entity === 'formulas' ? 'formula_ingredients' : 'product_variants';
        $fk = $entity === 'formulas' ? 'formula_id' : 'product_id';
        $stmt = $pdo->prepare("SELECT * FROM $child WHERE $fk = ? ORDER BY id");
        $stmt->execute([$id]);
        $data[$entity === 'formulas' ? 'ingredients' : 'variants'] = array_map(function ($r) use ($child) { return businessMap($child, $r); }, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    return $data;
}

function businessWriteRow(PDO $pdo, string $entity, string $id, array $data, bool $update): void {
    $params = [];
    foreach (businessSchema($entity) as $field) {
        if (!array_key_exists($field, $data)) continue;
        $value = $data[$field];
        if (is_array($value)) $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $params[businessColumn($field)] = $value;
    }
    $cols = array_keys($params);
    if ($update) {
        $sql = "UPDATE $entity SET " . implode(', ', array_map(function ($c) { return "$c = ?"; }, $cols)) . ' WHERE id = ?';
        $values = array_values($params); $values[] = $id;
    } else {
        $cols[] = 'id'; $values = array_values($params); $values[] = $id;
        $sql = "INSERT INTO $entity (" . implode(',', $cols) . ') VALUES (' . implode(',', array_fill(0, count($cols), '?')) . ')';
    }
    $pdo->prepare($sql)->execute($values);
}

function businessFormulaItems(PDO $pdo, array $items): array {
    if (!$items) throw new InvalidArgumentException('At least one ingredient is required.');
    $result = [];
    foreach ($items as $item) {
        if (!is_array($item)) throw new InvalidArgumentException('Invalid ingredient item.');
        $id = $item['ingredientId'] ?? '';
        businessRealId($id, 'ing');
        $quantity = businessNumber($item['quantity'] ?? null, 'quantity', true);
        $percentage = businessNumber($item['percentage'] ?? 0, 'percentage');
        if ($percentage > 100) throw new InvalidArgumentException('Percentage cannot exceed 100.');
        // Lock ingredient snapshot so concurrent cost changes cannot split this write.
        $stmt = $pdo->prepare('SELECT i.*, s.name AS supplier_name FROM ingredients i LEFT JOIN suppliers s ON s.id = i.default_supplier_id WHERE i.id = ? AND i.is_active = 1 FOR UPDATE');
        $stmt->execute([$id]); $ing = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$ing) throw new InvalidArgumentException('Ingredient not found or inactive.');
        $cost = businessNumber(round($quantity * (float)$ing['unit_cost_ars'], 4), 'calculatedCostARS');
        $result[] = ['ingredientId'=>$id, 'ingredientName'=>$ing['name'], 'category'=>$ing['category'], 'quantity'=>$quantity, 'unit'=>$ing['unit'], 'percentage'=>$percentage, 'unitCostARS'=>(float)$ing['unit_cost_ars'], 'supplierId'=>$ing['default_supplier_id'], 'supplierName'=>$ing['supplier_name'], 'calculatedCostARS'=>$cost];
    }
    return $result;
}

function businessVariants(PDO $pdo, array $data): array {
    $formula = null;
    if (!empty($data['formulaId'])) {
        businessRealId($data['formulaId'], 'form');
        try { $formula = businessRead($pdo, 'formulas', $data['formulaId'], true); }
        catch (OutOfBoundsException $e) { throw new InvalidArgumentException('Formula not found or inactive.'); }
    }
    $items = $data['variants']; $result = [];
    foreach ($items as $item) {
        if (!is_array($item)) throw new InvalidArgumentException('Invalid variant.');
        businessRequired($item, ['sku'=>128,'size'=>128,'unit'=>32,'aroma'=>255,'status'=>32]);
        if (!in_array($item['status'], ['Activo','Inactivo'], true)) throw new InvalidArgumentException('Invalid variant status.');
        $cost = $formula ? $formula['unitCostARS'] : businessNumber($item['estimatedCostARS'] ?? null, 'estimatedCostARS');
        $markup = businessNumber($item['marginPercent'] ?? 65, 'marginPercent');
        if ($markup > 999999) throw new InvalidArgumentException('Markup is out of range.');
        $result[] = ['sku'=>$item['sku'],'size'=>$item['size'],'unit'=>$item['unit'],'aroma'=>$item['aroma'],'status'=>$item['status'],'salePriceARS'=>businessNumber($item['salePriceARS'] ?? null,'salePriceARS'),'estimatedCostARS'=>$cost,'marginPercent'=>$markup,'suggestedSalePriceARS'=>round($cost * (1 + $markup/100),2)];
    }
    return [$formula, $result];
}

function businessSave(PDO $pdo, string $entity, array $input, ?string $id = null): array {
    $update = $id !== null;
    $pdo->beginTransaction();
    try {
        $data = $id ? array_replace(businessRead($pdo, $entity, $id, true), $input) : $input;
        $prefix = ['clients'=>'cli','formulas'=>'form','catalog_products'=>'prod'][$entity];
        if ($id) businessRealId($id, $prefix);
        $id = $id ?: generateId($prefix);
        validateBusinessInput($entity, $data);
        $children = [];
        if ($entity === 'clients') {
            $data += ['status'=>'Activo','email'=>null,'address'=>null,'notes'=>null,'lastOrderDate'=>null];
            foreach (['email','lastOrderDate'] as $field) if ($data[$field] === '') $data[$field] = null;
        } elseif ($entity === 'formulas') {
            $data += ['yieldUnits'=>1,'suggestedMarginPercent'=>65];
            $data['yieldUnits'] = businessNumber($data['yieldUnits'], 'yieldUnits', true);
            $children = businessFormulaItems($pdo, $data['ingredients']);
            $data['totalCostARS'] = businessNumber(round(array_sum(array_column($children, 'calculatedCostARS')), 4), 'totalCostARS');
            $data['unitCostARS'] = businessNumber(round($data['totalCostARS'] / $data['yieldUnits'], 4), 'unitCostARS');
        } else {
            list($formula, $children) = businessVariants($pdo, $data);
            $data['formulaId'] = $formula ? $formula['id'] : null;
            $data['formulaName'] = $formula ? $formula['name'] : null;
        }
        businessWriteRow($pdo, $entity, $id, $data, $update);
        if ($entity !== 'clients') {
            $child = $entity === 'formulas' ? 'formula_ingredients' : 'product_variants';
            $fk = $entity === 'formulas' ? 'formulaId' : 'productId';
            $pdo->prepare("DELETE FROM $child WHERE " . businessColumn($fk) . ' = ?')->execute([$id]);
            foreach ($children as $item) { $item[$fk] = $id; businessWriteRow($pdo,$child,generateId($child === 'formula_ingredients' ? 'fi' : 'var'),$item,false); }
        }
        if ($entity === 'formulas') {
            // Refresh linked estimates while preserving approved commercial prices.
            $stmt = $pdo->prepare('UPDATE product_variants SET estimated_cost_ars = ?, suggested_sale_price_ars = ROUND(? * (1 + COALESCE(margin_percent,65)/100.0),2) WHERE product_id IN (SELECT id FROM catalog_products WHERE formula_id = ? AND is_active = 1)');
            $stmt->execute([$data['unitCostARS'], $data['unitCostARS'], $id]);
            $pdo->prepare('UPDATE catalog_products SET formula_name = ? WHERE formula_id = ?')->execute([$data['name'],$id]);
        }
        $result = businessRead($pdo, $entity, $id);
        $pdo->commit();
        return $result;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function businessDelete(PDO $pdo, string $entity, string $id): void {
    businessRealId($id, ['clients'=>'cli','formulas'=>'form','catalog_products'=>'prod'][$entity]);
    if ($entity === 'formulas') {
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare('SELECT id FROM formulas WHERE id = ? AND is_active = 1 FOR UPDATE');
            $stmt->execute([$id]);
            if (!$stmt->fetch()) throw new OutOfBoundsException('Record not found or inactive.');
            // Keep variant prices and costs as the last commercial snapshot.
            $pdo->prepare('UPDATE catalog_products SET formula_id = NULL, formula_name = NULL, updated_at = NOW() WHERE formula_id = ? AND is_active = 1')->execute([$id]);
            $stmt = $pdo->prepare('UPDATE formulas SET is_active = 0, updated_at = NOW() WHERE id = ? AND is_active = 1');
            $stmt->execute([$id]);
            if (!$stmt->rowCount()) throw new OutOfBoundsException('Record not found or inactive.');
            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
        return;
    }
    $stmt = $pdo->prepare("UPDATE $entity SET is_active = 0 WHERE id = ? AND is_active = 1"); $stmt->execute([$id]);
    if (!$stmt->rowCount()) throw new OutOfBoundsException('Record not found or inactive.');
}

function businessEndpoint(string $entity): void {
    $pdo = getDbConnection(); $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'); $id = $_GET['id'] ?? null;
    try {
        if ($id !== null) businessRealId($id, ['clients'=>'cli','formulas'=>'form','catalog_products'=>'prod'][$entity]);
        if ($method === 'GET') {
            if ($id) sendSuccess(businessRead($pdo,$entity,$id));
            $ids = $pdo->query("SELECT id FROM $entity WHERE is_active = 1 ORDER BY name, id")->fetchAll(PDO::FETCH_COLUMN);
            sendSuccess(array_map(function ($key) use ($pdo,$entity) { return businessRead($pdo,$entity,$key); }, $ids));
        } elseif ($method === 'POST') sendSuccess(businessSave($pdo,$entity,getRequestJson()),201);
        elseif ($method === 'PUT') {
            if (!$id) throw new InvalidArgumentException('ID is required.');
            sendSuccess(businessSave($pdo,$entity,getRequestJson(),$id));
        } elseif ($method === 'DELETE') {
            if (!$id) throw new InvalidArgumentException('ID is required.');
            businessDelete($pdo,$entity,$id);
            sendSuccess(['id'=>$id,'deleted'=>true]);
        } else sendError('METHOD_NOT_ALLOWED','Method not allowed.',405);
    } catch (InvalidArgumentException $e) { sendError('VALIDATION_ERROR',$e->getMessage(),400); }
    catch (OutOfBoundsException $e) { sendError('NOT_FOUND',$e->getMessage(),404); }
    catch (PDOException $e) {
        error_log('Business persistence error: ' . $e->getMessage());
        sendError($e->getCode() === '23000' ? 'CONFLICT' : 'DB_ERROR', $e->getCode() === '23000' ? 'SKU already exists or a linked record is invalid.' : 'Unable to save business record.', $e->getCode() === '23000' ? 409 : 500);
    } catch (Throwable $e) { error_log($e->getMessage()); sendError('INTERNAL_ERROR','Unable to process business record.',500); }
}
