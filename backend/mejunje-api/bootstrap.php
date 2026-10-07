<?php
/**
 * MEJUNJE Backoffice API - Central Bootstrap File
 * Handles CORS, HTTP preflight, response helpers, and PDO Database Connection.
 */

// Disable direct display of PHP errors to prevent HTML stack traces in JSON API output
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/response.php';

// -----------------------------------------------------------------------------
// CORS HANDLING
// -----------------------------------------------------------------------------
$allowedOrigins = [
    'https://www.mejunje.com.ar',
    'https://mejunje.com.ar',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
];

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!empty($httpOrigin)) {
    if (in_array($httpOrigin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $httpOrigin);
    }
    // Always set Vary: Origin when handling CORS based on Origin header
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Preflight OPTIONS response
if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// -----------------------------------------------------------------------------
// DATABASE BOOTSTRAP
// -----------------------------------------------------------------------------
if (!function_exists('getDbConnection')) {
    /**
     * Reusable PDO connection bootstrap.
     * Loads configuration from BlueHost private path or fallback local file.
     *
     * @return PDO
     */
    function getDbConnection(): PDO {
        static $pdo = null;

        if ($pdo !== null) {
            return $pdo;
        }

        $configPath = '/home3/athcomar/mejunje_api_config/dev.php';
        $config = null;

        if (file_exists($configPath)) {
            $loaded = require $configPath;
            if (is_array($loaded)) {
                $config = $loaded;
            }
        } elseif (file_exists(__DIR__ . '/config.local.php')) {
            $loaded = require __DIR__ . '/config.local.php';
            if (is_array($loaded)) {
                $config = $loaded;
            }
        }

        $dbConfig = is_array($config) && isset($config['db']) && is_array($config['db']) ? $config['db'] : null;

        if ($dbConfig !== null) {
            $host    = $dbConfig['host']     ?? 'localhost';
            $port    = $dbConfig['port']     ?? 3306;
            $db      = $dbConfig['name']     ?? '';
            $user    = $dbConfig['user']     ?? '';
            $pass    = $dbConfig['password'] ?? '';
            $charset = $dbConfig['charset']  ?? 'utf8mb4';
        } else {
            // Environment variable fallback
            $host    = getenv('DB_HOST')    ?: '';
            $port    = (int)(getenv('DB_PORT') ?: 3306);
            $db      = getenv('DB_NAME')    ?: '';
            $user    = getenv('DB_USER')    ?: '';
            $pass    = getenv('DB_PASS')    ?: '';
            $charset = getenv('DB_CHARSET') ?: 'utf8mb4';
        }

        // Validate required credentials before attempting PDO connection
        if (empty($host) || empty($db) || empty($user)) {
            error_log("Database configuration error: Missing host, database name, or user.");
            sendError('DB_ERROR', 'Database connection error.', 500);
        }

        $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";

        try {
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci"
            ]);
            return $pdo;
        } catch (PDOException $e) {
            // Log details server-side if needed, but return clean JSON error without leaking DB credentials
            error_log("Database connection error: " . $e->getMessage());
            sendError('DB_ERROR', 'Database connection error.', 500);
        }
    }
}
