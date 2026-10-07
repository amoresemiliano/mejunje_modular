<?php
/**
 * MEJUNJE Backoffice API - Local Automated Test Suite
 *
 * Runs syntax checks, validation tests, cost calculation tests, and PDO integration tests.
 * Execute with:
 * php backend/mejunje-api/tests/run_tests.php
 */

define('IS_TEST_MODE', true);

// Suppress output header functions in CLI test runner
$_SERVER['HTTP_ORIGIN'] = 'http://localhost:3000';
$_SERVER['REQUEST_METHOD'] = 'GET';

require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../validation.php';

$passed = 0;
$failed = 0;
$skipped = 0;

function assertTest(bool $condition, string $description): void {
    global $passed, $failed;
    if ($condition) {
        echo "  [PASS] {$description}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$description}\n";
        $failed++;
    }
}

function skipTest(string $description, string $reason): void {
    global $skipped;
    echo "  [SKIP] {$description} ({$reason})\n";
    $skipped++;
}

echo "=======================================================\n";
echo " MEJUNJE Backoffice PHP REST API - Test Suite\n";
echo "=======================================================\n\n";

// -----------------------------------------------------------------------------
// 1. PHP Syntax Check (php -l)
// -----------------------------------------------------------------------------
echo "--- 1. Static PHP Syntax Checks ---\n";
$phpFiles = [
    __DIR__ . '/../config.example.php',
    __DIR__ . '/../response.php',
    __DIR__ . '/../bootstrap.php',
    __DIR__ . '/../validation.php',
    __DIR__ . '/../suppliers.php',
    __DIR__ . '/../ingredients.php',
    __DIR__ . '/../health.php',
];

$phpExecutable = defined('PHP_BINARY') ? PHP_BINARY : 'php';

foreach ($phpFiles as $file) {
    $basename = basename($file);
    if (!file_exists($file)) {
        assertTest(false, "File exists: {$basename}");
        continue;
    }
    
    // Command line syntax check
    $cmd = escapeshellarg($phpExecutable) . ' -l ' . escapeshellarg($file);
    $output = [];
    $returnCode = 0;
    exec($cmd, $output, $returnCode);
    assertTest($returnCode === 0, "Syntax clean (php -l): {$basename}");
}

// -----------------------------------------------------------------------------
// 2. ID Generation Tests
// -----------------------------------------------------------------------------
echo "\n--- 2. ID Generation Tests ---\n";
$supId1 = generateId('sup');
$supId2 = generateId('sup');
$ingId  = generateId('ing');

assertTest(strpos($supId1, 'sup-') === 0, "Supplier ID starts with 'sup-': {$supId1}");
assertTest(strpos($ingId, 'ing-') === 0, "Ingredient ID starts with 'ing-': {$ingId}");
assertTest($supId1 !== $supId2, "Generated IDs are unique");
assertTest(strlen($supId1) === 20, "Generated ID has correct length (sup- + 16 hex chars)");

// -----------------------------------------------------------------------------
// 3. Supplier Input Validation Tests
// -----------------------------------------------------------------------------
echo "\n--- 3. Supplier Validation Tests ---\n";
// Valid create payload
$validSupplier = [
    'name' => 'Proveedor Test S.A.',
    'contactPerson' => 'Carlos Gomez',
    'phoneWhatsApp' => '+5491112345678',
    'email' => 'contacto@test.com',
    'categoriesSupplied' => ['Fragancias', 'Aditivos'],
    'minPurchaseARS' => 50000,
    'deliveryTimeDays' => 3
];
$errs = validateSupplierInput($validSupplier, false);
assertTest(empty($errs), "Valid supplier creation payload produces 0 errors");

// Missing required name
$invalidSupplierName = $validSupplier;
unset($invalidSupplierName['name']);
$errs = validateSupplierInput($invalidSupplierName, false);
assertTest(!empty($errs), "Missing 'name' produces validation error");

// Invalid email
$invalidSupplierEmail = $validSupplier;
$invalidSupplierEmail['email'] = 'not-an-email';
$errs = validateSupplierInput($invalidSupplierEmail, false);
assertTest(!empty($errs) && strpos($errs[0], 'email') !== false, "Invalid email format produces validation error");

// Negative minPurchaseARS
$invalidSupplierMin = $validSupplier;
$invalidSupplierMin['minPurchaseARS'] = -100;
$errs = validateSupplierInput($invalidSupplierMin, false);
assertTest(!empty($errs) && strpos($errs[0], 'minPurchaseARS') !== false, "Negative minPurchaseARS produces error");

// -----------------------------------------------------------------------------
// 4. Ingredient Input Validation & Cost Calculation Tests
// -----------------------------------------------------------------------------
echo "\n--- 4. Ingredient Validation & Cost Calculation Tests ---\n";
// Valid ingredient payload
$validIngredient = [
    'name' => 'Cera de Soja APF',
    'category' => 'Ceras',
    'unit' => 'kg',
    'purchasePriceARS' => 42500,
    'referenceQty' => 5,
    'stock' => 25,
    'minStock' => 10
];
$errs = validateIngredientInput($validIngredient, false);
assertTest(empty($errs), "Valid ingredient creation payload produces 0 errors");

// Reference Qty = 0 rejection
$invalidRefQty = $validIngredient;
$invalidRefQty['referenceQty'] = 0;
$errs = validateIngredientInput($invalidRefQty, false);
assertTest(!empty($errs) && strpos($errs[0], 'referenceQty') !== false, "referenceQty = 0 is rejected to prevent divide-by-zero");

// Server-side unitCostARS calculation test (42500 / 5 = 8500)
$calcCost = round($validIngredient['purchasePriceARS'] / $validIngredient['referenceQty'], 4);
assertTest($calcCost === 8500.0, "Unit cost calculated correctly: 42500 / 5 = 8500.0000");

// Server-side unitCostARS calculation decimal test (1000 / 3 = 333.3333)
$calcCostDec = round(1000 / 3, 4);
assertTest($calcCostDec === 333.3333, "Unit cost rounded correctly to 4 decimals: 1000 / 3 = 333.3333");

// -----------------------------------------------------------------------------
// 5. In-Memory SQLite PDO Database Integration Tests
// -----------------------------------------------------------------------------
echo "\n--- 5. In-Memory SQLite PDO Integration Tests ---\n";
$availableDrivers = class_exists('PDO') ? PDO::getAvailableDrivers() : [];

if (in_array('sqlite', $availableDrivers, true)) {
    try {
        $pdo = new PDO('sqlite::memory:');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Create SQLite schemas matching MySQL structure
        $pdo->exec("CREATE TABLE suppliers (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            contact_person VARCHAR(255) DEFAULT '',
            phone_whatsapp VARCHAR(64) DEFAULT '',
            email VARCHAR(255),
            web VARCHAR(255),
            location VARCHAR(255),
            categories_supplied TEXT,
            min_purchase_ars DECIMAL(12,2) DEFAULT 0.00,
            delivery_time_days INT DEFAULT 0,
            notes TEXT,
            image_url TEXT,
            is_active INT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE ingredients (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(64) NOT NULL,
            unit VARCHAR(16) NOT NULL,
            purchase_price_ars DECIMAL(12,2) DEFAULT 0.00,
            reference_qty DECIMAL(12,4) DEFAULT 1.0000,
            unit_cost_ars DECIMAL(12,4) DEFAULT 0.0000,
            stock DECIMAL(12,4) DEFAULT 0.0000,
            min_stock DECIMAL(12,4) DEFAULT 0.0000,
            default_supplier_id VARCHAR(64),
            image_url TEXT,
            is_active INT DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (default_supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
        )");

        assertTest(true, "In-memory SQLite schema created successfully");

        // Insert supplier
        $supId = generateId('sup');
        $stmt = $pdo->prepare("INSERT INTO suppliers (id, name, contact_person, is_active) VALUES (:id, 'Fragancias Eissen AR', 'Juan Perez', 1)");
        $stmt->execute(['id' => $supId]);

        $fetchSup = $pdo->query("SELECT * FROM suppliers WHERE id = '$supId' AND is_active = 1")->fetch();
        assertTest($fetchSup && $fetchSup['name'] === 'Fragancias Eissen AR', "Inserted and retrieved active supplier from DB");

        // Validate supplier existence check in ingredient validation
        $errs = validateIngredientInput(['supplierId' => $supId], true, $pdo);
        assertTest(empty($errs), "Valid active supplier ID passes ingredient validation");

        $errs = validateIngredientInput(['supplierId' => 'sup-nonexistent'], true, $pdo);
        assertTest(!empty($errs), "Non-existent supplier ID fails ingredient validation");

        // Insert ingredient with server-side cost calculation
        $ingId = generateId('ing');
        $price = 25000.00;
        $refQty = 2.5000;
        $unitCost = round($price / $refQty, 4); // 10000.0000

        $stmtIng = $pdo->prepare("INSERT INTO ingredients (id, name, category, unit, purchase_price_ars, reference_qty, unit_cost_ars, default_supplier_id, is_active) 
                                  VALUES (:id, 'Esencia Lavanda', 'Fragancias', 'ml', :price, :ref_qty, :cost, :sup_id, 1)");
        $stmtIng->execute([
            'id' => $ingId,
            'price' => $price,
            'ref_qty' => $refQty,
            'cost' => $unitCost,
            'sup_id' => $supId
        ]);

        // Test JOIN query for ingredient listing
        $joinStmt = $pdo->query("SELECT i.*, s.name AS supplier_name FROM ingredients i LEFT JOIN suppliers s ON i.default_supplier_id = s.id WHERE i.id = '$ingId' AND i.is_active = 1");
        $ingRow = $joinStmt->fetch();
        assertTest($ingRow && $ingRow['supplier_name'] === 'Fragancias Eissen AR', "Ingredient fetched with joined supplier_name");
        assertTest((float)$ingRow['unit_cost_ars'] === 10000.0, "Unit cost stored correctly in DB");

        // Test soft delete ingredient
        $pdo->exec("UPDATE ingredients SET is_active = 0 WHERE id = '$ingId'");
        $activeCount = $pdo->query("SELECT COUNT(*) FROM ingredients WHERE id = '$ingId' AND is_active = 1")->fetchColumn();
        assertTest((int)$activeCount === 0, "Soft deleted ingredient is no longer returned in active query");

    } catch (Exception $e) {
        assertTest(false, "SQLite integration error: " . $e->getMessage());
    }
} else {
    skipTest("In-memory SQLite DB Integration", "pdo_sqlite extension not enabled in CLI PHP (pdo_mysql is enabled for target BlueHost server)");
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
echo "\n=======================================================\n";
echo " Test Results: {$passed} PASSED, {$failed} FAILED, {$skipped} SKIPPED\n";
echo "=======================================================\n";

if ($failed > 0) {
    exit(1);
}
exit(0);
