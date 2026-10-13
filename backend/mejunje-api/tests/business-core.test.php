<?php
/** Local SQL/transaction tests, SQLite adapter strips MySQL's row-lock suffix.
 * This suite does not verify MySQL locking, DDL, or BlueHost runtime behavior.
 */
require_once __DIR__ . '/../business-core.php';
class LocalDatabase extends PDO {
    public function __construct() { parent::__construct('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]); }
    public function prepare(string $query, array $options = []): PDOStatement|false { return parent::prepare(str_replace(' FOR UPDATE','',$query),$options); }
}
$db = new LocalDatabase();
$db->exec('PRAGMA foreign_keys = ON');
$db->exec('CREATE TABLE suppliers (id TEXT PRIMARY KEY, name TEXT)');
$db->exec('CREATE TABLE ingredients (id TEXT PRIMARY KEY, name TEXT, category TEXT, unit TEXT, unit_cost_ars NUMERIC, default_supplier_id TEXT, is_active INTEGER)');
// Generate test columns from the reviewed fixed schema; not a MySQL DDL test.
foreach (['clients','formulas','catalog_products','formula_ingredients','product_variants'] as $table) {
    $columns = ['id TEXT PRIMARY KEY'];
    foreach (businessSchema($table) as $field) $columns[] = businessColumn($field) . (in_array($field,['sku'],true) ? ' TEXT UNIQUE' : (preg_match('/CostARS$|PriceARS$|Percent$|^quantity$|^percentage$|^yieldUnits$|^batchSizeGrams$/',$field) ? ' NUMERIC' : ' TEXT'));
    if (in_array($table,['clients','formulas','catalog_products'],true)) $columns[]='is_active INTEGER DEFAULT 1';
    $db->exec("CREATE TABLE $table (".implode(',',$columns).')');
}
$count=0;
function check($condition, $label) { global $count; if (!$condition) throw new RuntimeException($label); ++$count; echo "PASS $label\n"; }
function rejects(callable $fn, string $label) { try { $fn(); } catch (InvalidArgumentException|OutOfBoundsException|PDOException $e) { check(true,$label); return; } throw new RuntimeException("Expected rejection: $label"); }
$ing='ing-1111111111111111'; $inactive='ing-2222222222222222';
$db->exec("INSERT INTO suppliers VALUES ('sup-1111111111111111','Real supplier')");
$stmt=$db->prepare('INSERT INTO ingredients VALUES (?,?,?,?,?,?,?)');
$stmt->execute([$ing,'Real wax','Ceras','g',4,'sup-1111111111111111',1]);
$stmt->execute([$inactive,'Inactive wax','Ceras','g',99,null,0]);

$client=['name'=>'Shop','phone'=>'+123','type'=>'Boutique'];
$created=businessSave($db,'clients',$client);
check(preg_match('/^cli-[a-f0-9]{16}$/',$created['id'])===1,'client secure ID / create');
$updated=businessSave($db,'clients',['name'=>'Updated shop'],$created['id']);
check($updated['name']==='Updated shop' && $updated['phone']==='+123','client partial update');
$duplicate=businessSave($db,'clients',array_replace($updated,['name'=>'Copy']));
check($duplicate['id']!==$created['id'],'duplicate inserts distinct client');
check(businessRead($db,'clients',$duplicate['id'])['name']==='Copy','reload reads persisted client');
businessDelete($db,'clients',$created['id']);
check((int)$db->query("SELECT is_active FROM clients WHERE id = '".$created['id']."'")->fetchColumn()===0,'client soft deletion retains row');
rejects(fn()=>businessRead($db,'clients',$created['id']),'deleted client unavailable');
rejects(fn()=>businessDelete($db,'clients','client-demo'),'demo entity rejected');

$formula=['name'=>'Wax batch','category'=>'Vela','yieldSize'=>'200 g','yieldUnits'=>10,'batchSizeGrams'=>2000,'status'=>'Borrador','version'=>'v1','totalCostARS'=>999999,'unitCostARS'=>999999,'ingredients'=>[['ingredientId'=>$ing,'quantity'=>100,'percentage'=>100,'unitCostARS'=>999999,'calculatedCostARS'=>1,'ingredientName'=>'Fake','unit'=>'kg']]];
$f=businessSave($db,'formulas',$formula);
check($f['totalCostARS']===400.0,'server ignores client total and item costs');
check($f['unitCostARS']===40.0 && $f['yieldUnits']===10.0,'unit cost = total / yield');
check($f['ingredients'][0]['ingredientName']==='Real wax' && $f['ingredients'][0]['unit']==='g' && $f['ingredients'][0]['category']==='Ceras','ingredient snapshot from database');
check($f['ingredients'][0]['supplierName']==='Real supplier','supplier snapshot');
foreach ([0,-1,'bad',0.000001] as $yield) rejects(fn()=>businessSave($db,'formulas',array_replace($formula,['yieldUnits'=>$yield])),'reject invalid yield '.strval($yield));
foreach (['ing-3333333333333333',$inactive,'demo-ing'] as $id) rejects(fn()=>businessSave($db,'formulas',array_replace($formula,['ingredients'=>[['ingredientId'=>$id,'quantity'=>1]]])),'reject missing / inactive / demo ingredient '.$id);
$f=businessSave($db,'formulas',['ingredients'=>[['ingredientId'=>$ing,'quantity'=>250,'percentage'=>100]]],$f['id']);
check(count($f['ingredients'])===1 && $f['totalCostARS']===1000.0 && $f['unitCostARS']===100.0,'atomic ingredient replacement and recost');
rejects(fn()=>businessSave($db,'formulas',['name'=>'Must roll back','ingredients'=>[['ingredientId'=>$ing,'quantity'=>1],['ingredientId'=>$inactive,'quantity'=>1]]],$f['id']),'invalid item rolls back update');
check(businessRead($db,'formulas',$f['id'])['name']==='Wax batch' && businessRead($db,'formulas',$f['id'])['totalCostARS']===1000.0 && !$db->inTransaction(),'formula parent and items unchanged after failure');

$variant=['sku'=>'WAX-200','size'=>'200 g','unit'=>'unid','aroma'=>'Wax','salePriceARS'=>180,'estimatedCostARS'=>9999,'marginPercent'=>65,'status'=>'Activo'];
$product=['sku'=>'WAX','name'=>'Candle','category'=>'Vela','description'=>'','shortDescription'=>'','collection'=>'','fragranceFamily'=>'','status'=>'Activo','formulaId'=>$f['id'],'variants'=>[$variant]];
$p=businessSave($db,'catalog_products',$product);
check(count($p['variants'])===1 && $p['formulaId']===$f['id'],'product parent / variant / formula persisted');
check($p['variants'][0]['estimatedCostARS']===100.0 && $p['variants'][0]['suggestedSalePriceARS']===165.0,'formula unit cost and markup authoritative');
check($p['variants'][0]['salePriceARS']===180.0,'approved price independent of suggestion');
$f=businessSave($db,'formulas',['ingredients'=>[['ingredientId'=>$ing,'quantity'=>500,'percentage'=>100]]],$f['id']);
$p=businessRead($db,'catalog_products',$p['id']);
check($p['variants'][0]['estimatedCostARS']===200.0 && $p['variants'][0]['suggestedSalePriceARS']===330.0 && $p['variants'][0]['salePriceARS']===180.0,'formula change refreshes estimates without overwriting approval');
$oldVariantId=$p['variants'][0]['id'];
$p=businessSave($db,'catalog_products',['variants'=>[array_replace($variant,['sku'=>'WAX-NEW','salePriceARS'=>250])]],$p['id']);
check(count($p['variants'])===1 && $p['variants'][0]['id']!==$oldVariantId && $p['variants'][0]['sku']==='WAX-NEW','atomic variant replacement');
// Duplicate child SKU fails AFTER parent update + delete + first insert: all must roll back.
rejects(fn()=>businessSave($db,'catalog_products',['name'=>'Must roll back','variants'=>[$variant,$variant]],$p['id']),'child SQL error triggers rollback');
$after=businessRead($db,'catalog_products',$p['id']);
check($after['name']==='Candle' && count($after['variants'])===1 && $after['variants'][0]['sku']==='WAX-NEW','parent and previous variants restored on child SQL failure');
$p2=businessSave($db,'catalog_products',array_replace($product,['sku'=>'NOFORM','formulaId'=>null,'variants'=>[array_replace($variant,['sku'=>'NOFORM-V','estimatedCostARS'=>50,'salePriceARS'=>100])]]));
check($p2['variants'][0]['estimatedCostARS']===50.0 && $p2['variants'][0]['suggestedSalePriceARS']===82.5,'unlinked product accepts explicit estimated cost');
$unlinked=businessSave($db,'catalog_products',['formulaId'=>null,'variants'=>[array_replace($variant,['sku'=>'UNLINKED','estimatedCostARS'=>30])]],$p['id']);
check($unlinked['formulaId']===null && $unlinked['variants'][0]['estimatedCostARS']===30.0,'explicit null unlinks a formula and enables manual cost');
businessDelete($db,'catalog_products',$p['id']);
rejects(fn()=>businessRead($db,'catalog_products',$p['id']),'product soft delete');
businessDelete($db,'formulas',$f['id']);
rejects(fn()=>businessRead($db,'formulas',$f['id']),'formula soft delete');
echo "$count assertions passed (local SQLite SQL adapter; MySQL locking not tested).\n";
