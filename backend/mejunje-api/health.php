<?php
/**
 * MEJUNJE Backoffice API - Health Check Endpoint
 *
 * GET /health[.php]
 * Verifies database connectivity without exposing sensitive infrastructure parameters.
 */

require_once __DIR__ . '/bootstrap.php';

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT 1");
    $stmt->fetch();

    sendSuccess([
        'service'     => 'mejunje-api',
        'environment' => 'dev',
        'connected'   => true
    ], 200);
} catch (Exception $e) {
    sendError('DB_ERROR', 'Database connection error.', 500);
}
