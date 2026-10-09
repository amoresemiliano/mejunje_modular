<?php
/** Focused endpoint acceptance tests. SQLite runs locally; no deployed database is used.
 * Run: php backend/mejunje-api/tests/purchase_orders_integrity.php
 * SQLite adapter removes MySQL FOR UPDATE; real MySQL lock contention is not simulated.
 */
require_once __DIR__ . '/../validation.php';

class LocalOrdersDb extends PDO {
    public array $locks = [];
    public int $increments = 0;
    public bool $failSecondUpdate = false;
    public function prepare(string $query, array $options = []): PDOStatement|false {
        if (strpos($query, 'FOR UPDATE') !== false) {
            if (!$this->inTransaction()) throw new RuntimeException('Lock outside transaction');
            $this->locks[] = strpos($query, 'FROM ingredients') !== false ? 'ingredient' : 'order';
        }
        if (strpos($query, 'UPDATE ingredients SET stock') !== false) {
            if (count($this->locks) !== 3) throw new RuntimeException('Stock changed before all ingredients locked');
            $this->increments++;
            if ($this->failSecondUpdate && $this->increments === 2) $query .= ' AND 1 = 0';
        }
        return parent::prepare(str_replace(' FOR UPDATE', '', $query), $options);
    }
}

if (isset($argv[1])) {
    $scenario = $argv[1];
    $db = new LocalOrdersDb('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->sqliteCreateFunction('NOW', fn() => '2026-10-09 12:00:00');
    $db->exec("CREATE TABLE suppliers (id TEXT, name TEXT, is_active INTEGER);
        INSERT INTO suppliers VALUES ('sup-1', 'Supplier', 1);
        CREATE TABLE ingredients (id TEXT, name TEXT, unit TEXT, default_supplier_id TEXT, is_active INTEGER, stock REAL);
        INSERT INTO ingredients VALUES ('ing-1', 'First', 'kg', 'sup-1', 1, 10), ('ing-2', 'Second', 'kg', 'sup-1', 1, 20);
        CREATE TABLE purchase_orders (id TEXT, code TEXT, supplier_id TEXT, supplier_name TEXT, order_date TEXT, status TEXT, subtotal_ars REAL, total_ars REAL, observations TEXT, received_at TEXT, is_active INTEGER, created_at TEXT, updated_at TEXT);
        INSERT INTO purchase_orders VALUES ('po-1','OC-1','sup-1','Supplier','2026-10-09','Confirmada',5,5,NULL,NULL,1,'','');
        CREATE TABLE purchase_order_items (id TEXT, purchase_order_id TEXT, ingredient_id TEXT, ingredient_name TEXT, ordered_qty REAL, unit TEXT, unit_price_ars REAL, subtotal_ars REAL);
        INSERT INTO purchase_order_items VALUES ('item-1','po-1','ing-1','First',2,'kg',1,2), ('item-2','po-1','ing-2','Second',3,'kg',1,3);");
    if ($scenario === 'inactive') $db->exec("UPDATE ingredients SET is_active=0 WHERE id='ing-2'");
    if ($scenario === 'missing') $db->exec("DELETE FROM ingredients WHERE id='ing-2'");
    if ($scenario === 'rowcount') $db->failSecondUpdate = true;
    if ($scenario === 'twice') $db->exec("UPDATE purchase_orders SET status='Recibida', received_at='2026-10-09 11:00:00'; UPDATE ingredients SET stock=stock+CASE id WHEN 'ing-1' THEN 2 ELSE 3 END");
    $payload = ['status' => 'Recibida'];
    $_GET = ['id' => 'po-1'];
    $_SERVER['REQUEST_METHOD'] = 'PUT';
    if (in_array($scenario, ['owned', 'other', 'unassigned', 'initial'], true)) {
        $payload = ['supplierId'=>'sup-1', 'status'=>$scenario === 'initial' ? 'Recibida' : 'Solicitada', 'items'=>[['ingredientId'=>'ing-1','requiredQty'=>2,'unitPriceARS'=>1]]];
        if ($scenario === 'other') $db->exec("UPDATE ingredients SET default_supplier_id='sup-2' WHERE id='ing-1'");
        if ($scenario === 'unassigned') $db->exec("UPDATE ingredients SET default_supplier_id=NULL WHERE id='ing-1'");
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_GET = [];
    }
    function getDbConnection(): PDO { global $db; return $db; }
    function getRequestJson(): array { global $payload; return $payload; }
    function finishResponse(array $response): void {
        global $db;
        echo json_encode(['response'=>$response, 'stocks'=>$db->query('SELECT id, stock FROM ingredients ORDER BY id')->fetchAll(), 'order'=>$db->query("SELECT status, received_at FROM purchase_orders WHERE id='po-1'")->fetch(), 'count'=>$db->query('SELECT COUNT(*) FROM purchase_orders')->fetchColumn(), 'increments'=>$db->increments, 'locks'=>$db->locks, 'transaction'=>$db->inTransaction()]);
        exit;
    }
    function sendError(string $code, string $message, int $statusCode=400): void { finishResponse(['success'=>false,'code'=>$code,'status'=>$statusCode,'message'=>$message]); }
    function sendSuccess($data=null, int $statusCode=200): void { finishResponse(['success'=>true,'status'=>$statusCode,'data'=>$data]); }
    $source = file_get_contents(__DIR__ . '/../purchase-orders.php');
    $source = str_replace(["require_once __DIR__ . '/bootstrap.php';", "require_once __DIR__ . '/validation.php';"], '', $source);
    eval(substr($source, 5));
    exit(1);
}

if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) { fwrite(STDERR, "pdo_sqlite required; tests cannot run.\n"); exit(1); }
$failed = 0;
function check(bool $ok, string $label): void { global $failed; echo ($ok ? '[PASS] ' : '[FAIL] ') . $label . "\n"; if (!$ok) $failed++; }
foreach (['active','inactive','missing','rowcount','twice','owned','other','unassigned','initial'] as $scenario) {
    $lines=[]; $exitCode=0;
    exec(escapeshellarg(PHP_BINARY).' '.escapeshellarg(__FILE__).' '.escapeshellarg($scenario), $lines, $exitCode);
    $r=json_decode(implode("\n", $lines), true);
    check($exitCode===0 && is_array($r), "$scenario endpoint completed");
    if (!is_array($r)) continue;
    $success = in_array($scenario, ['active','twice','owned'], true);
    check($r['response']['success']===$success, "$scenario response");
    check(!$r['transaction'], "$scenario transaction closed");
    if (in_array($scenario, ['active','twice'], true)) {
        check(array_column($r['stocks'],'stock')===[12,23], "$scenario exact stock, no double increment");
        check($r['order']['status']==='Recibida' && $r['order']['received_at']!==null, "$scenario status and received_at");
        check($r['increments']===($scenario==='active' ? 2 : 0), "$scenario increment count");
    } elseif (in_array($scenario, ['inactive','missing','rowcount'], true)) {
        check(array_column($r['stocks'],'stock')===($scenario==='missing' ? [10] : [10,20]), "$scenario no stock changed");
        check($r['order']['status']==='Confirmada' && $r['order']['received_at']===null, "$scenario status and received_at preserved");
        if ($scenario!=='rowcount') {
            check($r['increments']===0, "$scenario validated before stock updates");
            check($r['response']['code']==='VALIDATION_ERROR' && $r['response']['status']===400, "$scenario stable validation error");
        }
    } else {
        check($r['count']===($scenario==='owned' ? 2 : 1), "$scenario order creation count");
        check(array_column($r['stocks'],'stock')===[10,20], "$scenario creation never receives stock");
        if (!$success) check($r['response']['code']==='VALIDATION_ERROR' && $r['response']['status']===400, "$scenario validation error");
    }
}
$rollback = file_get_contents(__DIR__.'/../../../database/migrations/002_create_purchase_orders.rollback.sql');
check(strpos($rollback,'FOREIGN_KEY_CHECKS')===false, 'rollback never disables FK checking');
check(strpos($rollback,'DROP TABLE IF EXISTS purchase_order_items;') < strpos($rollback,'DROP TABLE IF EXISTS purchase_orders;'), 'rollback drops child before parent');
echo "Failures: $failed\n";
exit($failed ? 1 : 0);
