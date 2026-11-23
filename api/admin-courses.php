<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

configureApi();
startAdminSession();
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'] ?? '';

function decodeCourseRow(array $row): array
{
    $durations = json_decode((string) ($row['durations'] ?? ''), true);
    $outcomes = json_decode((string) ($row['outcomes'] ?? ''), true);

    return [
        'id' => (int) $row['id'],
        'slug' => $row['slug'],
        'title' => $row['title'],
        'description' => $row['description'],
        'overview' => $row['overview'] ?? '',
        'outcomes' => is_array($outcomes) ? $outcomes : [],
        'prerequisites' => $row['prerequisites'] ?? '',
        'durations' => is_array($durations) ? $durations : [],
        'is_active' => (int) $row['is_active'],
        'sort_order' => (int) $row['sort_order'],
        'created_at' => $row['created_at'] ?? null,
        'updated_at' => $row['updated_at'] ?? null,
    ];
}

try {
    $pdo = getDatabase();

    if ($method === 'GET') {
        $statement = $pdo->query("
            SELECT
                id,
                slug,
                title,
                description,
                overview,
                outcomes,
                prerequisites,
                durations,
                is_active,
                sort_order,
                created_at,
                updated_at
            FROM services
            WHERE category = 'training'
            ORDER BY sort_order ASC, id ASC
        ");

        $courses = array_map(
            'decodeCourseRow',
            $statement->fetchAll()
        );

        sendJson([
            'success' => true,
            'data' => $courses,
        ]);
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST, OPTIONS');

        sendJson([
            'success' => false,
            'message' => 'Method not allowed.',
        ], 405);
    }

    requireCsrfToken();

    $input = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($input)) {
        sendJson([
            'success' => false,
            'message' => 'Invalid request data.',
        ], 400);
    }

    $action = (string) ($input['action'] ?? 'save');

    /*
     * Publish or unpublish a course.
     */
    if ($action === 'status') {
        $id = filter_var(
            $input['id'] ?? null,
            FILTER_VALIDATE_INT
        );

        $isActive = filter_var(
            $input['is_active'] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || !in_array($isActive, [0, 1], true)) {
            sendJson([
                'success' => false,
                'message' => 'Invalid course status information.',
            ], 422);
        }

        $statement = $pdo->prepare("
            UPDATE services
            SET is_active = :is_active
            WHERE id = :id
              AND category = 'training'
        ");

        $statement->execute([
            ':is_active' => $isActive,
            ':id' => $id,
        ]);

        if ($statement->rowCount() === 0) {
            $check = $pdo->prepare("
                SELECT id, is_active
                FROM services
                WHERE id = :id
                  AND category = 'training'
                LIMIT 1
            ");

            $check->execute([':id' => $id]);
            $existing = $check->fetch();

            if (!$existing) {
                sendJson([
                    'success' => false,
                    'message' => 'Course not found.',
                ], 404);
            }
        }

        sendJson([
            'success' => true,
            'message' => $isActive === 1
                ? 'Course published successfully.'
                : 'Course unpublished successfully.',
        ]);
    }

    /*
     * Add or update a course.
     */
    if ($action !== 'save') {
        sendJson([
            'success' => false,
            'message' => 'Unsupported course action.',
        ], 400);
    }

    $id = null;

    if (isset($input['id']) && $input['id'] !== '') {
        $id = filter_var(
            $input['id'],
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            sendJson([
                'success' => false,
                'message' => 'Invalid course ID.',
            ], 422);
        }
    }

    $slug = trim((string) ($input['slug'] ?? ''));
    $title = trim((string) ($input['title'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));
    $overview = trim((string) ($input['overview'] ?? ''));
    $prerequisites = trim((string) ($input['prerequisites'] ?? ''));

    $outcomes = $input['outcomes'] ?? [];
    $durations = $input['durations'] ?? [];

    $sortOrder = filter_var(
        $input['sort_order'] ?? 0,
        FILTER_VALIDATE_INT
    );

    if ($sortOrder === false || $sortOrder < 0) {
        sendJson([
            'success' => false,
            'message' => 'Sort order must be a non-negative whole number.',
        ], 422);
    }

    if (
        $slug === '' ||
        strlen($slug) > 150 ||
        !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)
    ) {
        sendJson([
            'success' => false,
            'message' => 'Enter a valid course slug using lowercase letters, numbers and hyphens.',
        ], 422);
    }

    if ($title === '' || mb_strlen($title) > 200) {
        sendJson([
            'success' => false,
            'message' => 'Course title is required and must not exceed 200 characters.',
        ], 422);
    }

    if ($description === '') {
        sendJson([
            'success' => false,
            'message' => 'Course description is required.',
        ], 422);
    }

    if (!is_array($outcomes)) {
        sendJson([
            'success' => false,
            'message' => 'Learning outcomes must be a list.',
        ], 422);
    }

    $cleanOutcomes = [];

    foreach ($outcomes as $outcome) {
        if (!is_string($outcome)) {
            sendJson([
                'success' => false,
                'message' => 'Each learning outcome must be text.',
            ], 422);
        }

        $outcome = trim($outcome);

        if ($outcome !== '') {
            if (mb_strlen($outcome) > 500) {
                sendJson([
                    'success' => false,
                    'message' => 'Each learning outcome must not exceed 500 characters.',
                ], 422);
            }

            $cleanOutcomes[] = $outcome;
        }
    }

    if (!is_array($durations) || count($durations) === 0) {
        sendJson([
            'success' => false,
            'message' => 'Add at least one course duration and price.',
        ], 422);
    }

    $cleanDurations = [];

    foreach ($durations as $duration => $price) {
        if (!is_string($duration)) {
            sendJson([
                'success' => false,
                'message' => 'Invalid course duration.',
            ], 422);
        }

        $duration = trim($duration);

        if (
            $duration === '' ||
            mb_strlen($duration) > 30 ||
            !is_numeric($price) ||
            (float) $price <= 0 ||
            (float) $price > 999999
        ) {
            sendJson([
                'success' => false,
                'message' => 'Each duration must have a valid positive price.',
            ], 422);
        }

        $cleanDurations[$duration] = round((float) $price, 2);
    }

    /*
     * Prevent duplicate slugs across all service categories.
     */
    $duplicateSql = "
        SELECT id
        FROM services
        WHERE slug = :slug
    ";

    if ($id !== null) {
        $duplicateSql .= " AND id != :id";
    }

    $duplicateSql .= " LIMIT 1";

    $duplicateStatement = $pdo->prepare($duplicateSql);

    $duplicateParameters = [':slug' => $slug];

    if ($id !== null) {
        $duplicateParameters[':id'] = $id;
    }

    $duplicateStatement->execute($duplicateParameters);

    if ($duplicateStatement->fetch()) {
        sendJson([
            'success' => false,
            'message' => 'This course slug is already in use. Please choose another.',
        ], 409);
    }

    $durationsJson = json_encode(
        $cleanDurations,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    $outcomesJson = json_encode(
        $cleanOutcomes,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    if ($durationsJson === false || $outcomesJson === false) {
        sendJson([
            'success' => false,
            'message' => 'Unable to process course information.',
        ], 422);
    }

    if ($id !== null) {
        $statement = $pdo->prepare("
            UPDATE services
            SET
                slug = :slug,
                title = :title,
                description = :description,
                overview = :overview,
                outcomes = :outcomes,
                prerequisites = :prerequisites,
                durations = :durations,
                sort_order = :sort_order
            WHERE id = :id
              AND category = 'training'
        ");

        $statement->execute([
            ':slug' => $slug,
            ':title' => $title,
            ':description' => $description,
            ':overview' => $overview,
            ':outcomes' => $outcomesJson,
            ':prerequisites' => $prerequisites,
            ':durations' => $durationsJson,
            ':sort_order' => $sortOrder,
            ':id' => $id,
        ]);

        if ($statement->rowCount() === 0) {
            $check = $pdo->prepare("
                SELECT id
                FROM services
                WHERE id = :id
                  AND category = 'training'
                LIMIT 1
            ");

            $check->execute([':id' => $id]);

            if (!$check->fetch()) {
                sendJson([
                    'success' => false,
                    'message' => 'Course not found.',
                ], 404);
            }
        }

        sendJson([
            'success' => true,
            'message' => 'Course updated successfully.',
            'id' => $id,
        ]);
    }

    $statement = $pdo->prepare("
        INSERT INTO services (
            category,
            slug,
            title,
            description,
            overview,
            outcomes,
            prerequisites,
            durations,
            is_active,
            sort_order
        ) VALUES (
            'training',
            :slug,
            :title,
            :description,
            :overview,
            :outcomes,
            :prerequisites,
            :durations,
            0,
            :sort_order
        )
    ");

    $statement->execute([
        ':slug' => $slug,
        ':title' => $title,
        ':description' => $description,
        ':overview' => $overview,
        ':outcomes' => $outcomesJson,
        ':prerequisites' => $prerequisites,
        ':durations' => $durationsJson,
        ':sort_order' => $sortOrder,
    ]);

    sendJson([
        'success' => true,
        'message' => 'Course created successfully. It is currently unpublished.',
        'id' => (int) $pdo->lastInsertId(),
    ], 201);

} catch (Throwable $exception) {
    error_log(
        'Just Science course management API error: ' .
        $exception->getMessage()
    );

    sendJson([
        'success' => false,
        'message' => 'Unable to process the course request at this time.',
    ], 500);
}
