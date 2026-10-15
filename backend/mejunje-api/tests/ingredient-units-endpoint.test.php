<?php
/** Local SQLite endpoint harness; not MySQL migration / deployment verification. */
require_once __DIR__ . '/../validation.php';
if (isset($argv[1])) {
    $scenario = $argv[1];
    $db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $db->exec("CREATE TABLE suppliers (id TEXT, name TEXT, is_active INTEGER);
      INSERT INTO suppliers VALUES ('sup-1','Real supplier',1);
      CREATE TABLE ingredients (id TEXT, name TEXT, category TEXT, unit TEXT, purchase_unit TEXT, purchase_price_ars REAL, reference_qty REAL, unit_cost_ars REAL, stock REAL, min_stock REAL, default_supplier_id TEXT, image_url TEXT, is_active INTEGER, created_at TEXT, updated_at TEXT);
      INSERT INTO ingredients VALUES ('ing-1','Wax','Ceras','g','kg',42500,5,8.5,0,0,'sup-1',NULL,1,'','');
      CREATE TABLE purchase_orders (id TEXT, is_active INTEGER, status TEXT);
      CREATE TABLE purchase_order_items (purchase_order_id TEXT, ingredient_id TEXT);");
    $payloads = ['price'=>['purchasePriceARS'=>85000], 'quantity'=>['referenceQty'=>10], 'purchase-unit'=>['purchaseUnit'=>'g'], 'consumption-unit'=>['unit'=>'kg'], 'incompatible'=>['unit'=>'ml'], 'zero'=>['referenceQty'=>0], 'forged-cost'=>['unitCostARS'=>9999], 'stock-guard'=>['unit'=>'kg'], 'po-guard'=>['unit'=>'kg'], 'create'=>['name'=>'New','category'=>'Ceras','purchasePriceARS'=>42500,'referenceQty'=>5,'purchaseUnit'=>'kg','unit'=>'g','supplierId'=>'sup-1']];
    $payload = $payloads[$scenario];
    if ($scenario === 'stock-guard') $db->exec("UPDATE ingredients SET stock=5000");
    if ($scenario === 'po-guard') $db->exec("INSERT INTO purchase_orders VALUES ('po-1',1,'Solicitada'); INSERT INTO purchase_order_items VALUES ('po-1','ing-1')");
    $_GET = $scenario === 'create' ? [] : ['id'=>'ing-1'];
    $_SERVER['REQUEST_METHOD'] = $scenario === 'create' ? 'POST' : 'PUT';
    function getDbConnection(): PDO { global $db; return $db; }
    function getRequestJson(): array { global $payload; return $payload; }
    function sendSuccess($data=null, int $statusCode=200): void { echo json_encode(['success'=>true,'data'=>$data]); exit; }
    function sendError(string $code, string $message, int $statusCode=400): void { echo json_encode(['success'=>false,'code'=>$code,'status'=>$statusCode]); exit; }
    $source = file_get_contents(__DIR__ . '/../ingredients.php');
    $source = str_replace(["require_once __DIR__ . '/bootstrap.php';", "require_once __DIR__ . '/validation.php';"], '', $source);
    eval(substr($source,5)); exit(1);
}
$cases = ['price'=>17.0,'quantity'=>4.25,'purchase-unit'=>8500.0,'consumption-unit'=>8500.0,'forged-cost'=>8.5,'create'=>8.5,'incompatible'=>null,'zero'=>null,'stock-guard'=>null,'po-guard'=>null];
foreach ($cases as $scenario=>$expected) {
    $lines=[]; $code=0;
    exec(escapeshellarg(PHP_BINARY).' '.escapeshellarg(__FILE__).' '.escapeshellarg($scenario),$lines,$code);
    $response=json_decode(implode("\n",$lines),true);
    if ($code !== 0 || !is_array($response)) throw new RuntimeException("Endpoint failed: $scenario");
    if ($expected === null) {
        if ($response['success'] !== false || $response['code'] !== 'VALIDATION_ERROR') throw new RuntimeException("Expected rejection: $scenario");
    } else {
        if (!$response['success'] || (float)$response['data']['unitCostARS'] !== $expected || !isset($response['data']['purchaseUnit'])) throw new RuntimeException("Incorrect persisted cost / DTO: $scenario");
    }
    echo "PASS endpoint $scenario\n";
}
echo count($cases)." endpoint cases passed\n";
