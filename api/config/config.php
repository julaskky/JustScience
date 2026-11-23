<?php

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'justscience';
const DB_USER = 'root';
const DB_PASS = '';

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

function sendJson(array $data, int $status = 200): void
{
    http_response_code($status);

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

function configureApi(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin !== '') {
        if (!in_array($origin, ALLOWED_ORIGINS, true)) {
            sendJson([
                'success' => false,
                'message' => 'Origin not allowed.'
            ], 403);
        }

        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Accept, Content-Type, X-CSRF-Token');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function startAdminSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('justscience_admin');

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/justscience/api',
        'domain' => '',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function getCsrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function requireCsrfToken(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $stored = $_SESSION['csrf_token'] ?? '';

    if (
        $stored === '' ||
        $provided === '' ||
        !hash_equals($stored, $provided)
    ) {
        sendJson([
            'success' => false,
            'message' => 'Your security token is invalid. Refresh and try again.'
        ], 403);
    }
}

function requireAdmin(): array
{
    if (empty($_SESSION['admin_id'])) {
        sendJson([
            'success' => false,
            'message' => 'Please sign in to continue.'
        ], 401);
    }

    return [
        'id' => (int) $_SESSION['admin_id'],
        'name' => (string) ($_SESSION['admin_name'] ?? ''),
        'email' => (string) ($_SESSION['admin_email'] ?? ''),
    ];
}

function getDatabase(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST .
        ';dbname=' . DB_NAME .
        ';charset=utf8mb4';

    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    return $pdo;
}