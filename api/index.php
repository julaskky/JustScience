<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

configureApi();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET, OPTIONS');

    sendJson([
        'success' => false,
        'message' => 'Method not allowed.'
    ], 405);
}

sendJson([
    'success' => true,
    'application' => 'Just Science API',
    'status' => 'running',
    'version' => '1.0.0'
]);
