<?php
/**
 * MEJUNJE Backoffice API - Database Configuration (Example)
 *
 * Production/DEV location on BlueHost (OUTSIDE web root):
 * /home3/athcomar/mejunje_api_config/dev.php
 *
 * DO NOT commit real passwords or credentials to version control.
 */

return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'athcomar_mejunje_dev',
        'user' => 'YOUR_DB_USER',
        'password' => 'YOUR_DB_PASSWORD',
        'charset' => 'utf8mb4',
    ],
];
