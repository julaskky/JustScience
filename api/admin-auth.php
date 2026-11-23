<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

configureApi();
startAdminSession();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'csrf') {
    sendJson([
        'success' => true,
        'csrf_token' => getCsrfToken(),
    ]);
}

if ($method === 'GET' && $action === 'me') {
    if (empty($_SESSION['admin_id'])) {
        sendJson([
            'success' => true,
            'authenticated' => false,
        ]);
    }

    sendJson([
        'success' => true,
        'authenticated' => true,
        'admin' => [
            'id' => (int) $_SESSION['admin_id'],
            'name' => $_SESSION['admin_name'],
            'email' => $_SESSION['admin_email'],
        ],
        'csrf_token' => getCsrfToken(),
    ]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    sendJson(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireCsrfToken();

$input = json_decode(file_get_contents('php://input') ?: '', true);

if (!is_array($input)) {
    sendJson(['success' => false, 'message' => 'Invalid request.'], 400);
}

if ($action === 'login') {
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $password = (string) ($input['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        sendJson([
            'success' => false,
            'message' => 'Enter your email address and password.'
        ], 422);
    }

    try {
        $stmt = getDatabase()->prepare("
            SELECT id, full_name, email, password_hash, is_active
            FROM admins
            WHERE email = :email
            LIMIT 1
        ");

        $stmt->execute([':email' => $email]);
        $admin = $stmt->fetch();

        if (
            !$admin ||
            !(bool) $admin['is_active'] ||
            !password_verify($password, $admin['password_hash'])
        ) {
            sendJson([
                'success' => false,
                'message' => 'The email address or password is incorrect.'
            ], 401);
        }

        session_regenerate_id(true);

        $_SESSION['admin_id'] = (int) $admin['id'];
        $_SESSION['admin_name'] = $admin['full_name'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

        sendJson([
            'success' => true,
            'message' => 'Signed in successfully.',
            'admin' => [
                'id' => (int) $admin['id'],
                'name' => $admin['full_name'],
                'email' => $admin['email'],
            ],
            'csrf_token' => $_SESSION['csrf_token'],
        ]);

    } catch (PDOException $exception) {
        error_log('Just Science admin login error: ' . $exception->getMessage());

        sendJson([
            'success' => false,
            'message' => 'Unable to sign in at this time.'
        ], 500);
    }
}

if ($action === 'logout') {
    if (empty($_SESSION['admin_id'])) {
        sendJson(['success' => true, 'message' => 'Already signed out.']);
    }

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();

        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => 'Lax',
        ]);
    }

    session_destroy();

    sendJson([
        'success' => true,
        'message' => 'Signed out successfully.'
    ]);
}

sendJson(['success' => false, 'message' => 'Unknown action.'], 404);