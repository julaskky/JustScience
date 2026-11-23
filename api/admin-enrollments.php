<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

configureApi();
startAdminSession();
$admin = requireAdmin();

$pdo = getDatabase();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$allowedStatuses = [
    'pending',
    'contacted',
    'confirmed',
    'cancelled',
];

if ($method === 'GET') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if ($id) {
        $stmt = $pdo->prepare("
            SELECT *
            FROM course_enrollments
            WHERE id = :id
            LIMIT 1
        ");

        $stmt->execute([':id' => $id]);
        $enrollment = $stmt->fetch();

        if (!$enrollment) {
            sendJson([
                'success' => false,
                'message' => 'Enrolment record not found.'
            ], 404);
        }

        sendJson([
            'success' => true,
            'enrollment' => $enrollment,
        ]);
    }

    $status = trim((string) ($_GET['status'] ?? ''));
    $course = trim((string) ($_GET['course'] ?? ''));
    $search = trim((string) ($_GET['search'] ?? ''));
    $dateFrom = trim((string) ($_GET['date_from'] ?? ''));
    $dateTo = trim((string) ($_GET['date_to'] ?? ''));

    $page = max(1, (int) ($_GET['page'] ?? 1));
    $perPage = min(50, max(5, (int) ($_GET['per_page'] ?? 10)));
    $offset = ($page - 1) * $perPage;

    $where = [];
    $params = [];

    if ($status !== '' && in_array($status, $allowedStatuses, true)) {
        $where[] = 'status = :status';
        $params[':status'] = $status;
    }

    if ($course !== '') {
        $where[] = 'course_slug = :course';
        $params[':course'] = $course;
    }

    if ($search !== '') {
        $where[] = '(
            full_name LIKE :search_name
            OR email LIKE :search_email
            OR enrollment_reference LIKE :search_reference
            OR course_title LIKE :search_course
        )';

        $term = '%' . $search . '%';

        $params[':search_name'] = $term;
        $params[':search_email'] = $term;
        $params[':search_reference'] = $term;
        $params[':search_course'] = $term;
    }

    if ($dateFrom !== '') {
        $date = DateTime::createFromFormat('Y-m-d', $dateFrom);

        if ($date && $date->format('Y-m-d') === $dateFrom) {
            $where[] = 'submitted_at >= :date_from';
            $params[':date_from'] = $dateFrom . ' 00:00:00';
        }
    }

    if ($dateTo !== '') {
        $date = DateTime::createFromFormat('Y-m-d', $dateTo);

        if ($date && $date->format('Y-m-d') === $dateTo) {
            $where[] = 'submitted_at <= :date_to';
            $params[':date_to'] = $dateTo . ' 23:59:59';
        }
    }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $stats = $pdo->query("
        SELECT
            COUNT(*) AS total,
            SUM(status = 'pending') AS pending,
            SUM(status = 'contacted') AS contacted,
            SUM(status = 'confirmed') AS confirmed,
            SUM(status = 'cancelled') AS cancelled
        FROM course_enrollments
    ")->fetch();

    $countStmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM course_enrollments
        $whereSql
    ");

    $countStmt->execute($params);
    $totalRecords = (int) $countStmt->fetchColumn();

    $listStmt = $pdo->prepare("
        SELECT
            id,
            enrollment_reference,
            full_name,
            email,
            phone,
            country,
            course_slug,
            course_title,
            duration,
            price_usd,
            experience_level,
            status,
            submitted_at
        FROM course_enrollments
        $whereSql
        ORDER BY submitted_at DESC, id DESC
        LIMIT :limit OFFSET :offset
    ");

    foreach ($params as $key => $value) {
        $listStmt->bindValue($key, $value);
    }

    $listStmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $listStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $listStmt->execute();

    sendJson([
        'success' => true,
        'stats' => [
            'total' => (int) ($stats['total'] ?? 0),
            'pending' => (int) ($stats['pending'] ?? 0),
            'contacted' => (int) ($stats['contacted'] ?? 0),
            'confirmed' => (int) ($stats['confirmed'] ?? 0),
            'cancelled' => (int) ($stats['cancelled'] ?? 0),
        ],
        'enrollments' => $listStmt->fetchAll(),
        'pagination' => [
            'page' => $page,
            'per_page' => $perPage,
            'total_records' => $totalRecords,
            'total_pages' => max(1, (int) ceil($totalRecords / $perPage)),
        ],
    ]);
}

if ($method === 'POST') {
    requireCsrfToken();

    $input = json_decode(file_get_contents('php://input') ?: '', true);

    if (!is_array($input)) {
        sendJson(['success' => false, 'message' => 'Invalid request.'], 400);
    }

    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    $status = trim((string) ($input['status'] ?? ''));

    if (!$id || !in_array($status, $allowedStatuses, true)) {
        sendJson([
            'success' => false,
            'message' => 'Select a valid enrolment and status.'
        ], 422);
    }

    $stmt = $pdo->prepare("
        UPDATE course_enrollments
        SET status = :status
        WHERE id = :id
    ");

    $stmt->execute([
        ':status' => $status,
        ':id' => $id,
    ]);

    if ($stmt->rowCount() === 0) {
        $check = $pdo->prepare("
            SELECT id FROM course_enrollments WHERE id = :id
        ");
        $check->execute([':id' => $id]);

        if (!$check->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Enrolment record not found.'
            ], 404);
        }
    }

    sendJson([
        'success' => true,
        'message' => 'Enrolment status updated successfully.',
    ]);
}

header('Allow: GET, POST, OPTIONS');

sendJson([
    'success' => false,
    'message' => 'Method not allowed.'
], 405);