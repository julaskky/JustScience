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

try {
    $pdo = getDatabase();

    $sql = "
        SELECT
            id,
            category,
            slug,
            title,
            description,
            durations,
            sort_order
        FROM services
        WHERE is_active = 1
        ORDER BY category ASC, sort_order ASC, id ASC
    ";

    $statement = $pdo->query($sql);
    $services = $statement->fetchAll();

    $data = [];

    foreach ($services as $service) {
        $durations = null;

        if ($service['durations'] !== null) {
            $durations = json_decode(
                $service['durations'],
                true
            );

            if (!is_array($durations)) {
                $durations = [];
            }
        }

        $data[] = [
            'id' => (int) $service['id'],
            'category' => $service['category'],
            'slug' => $service['slug'],
            'title' => $service['title'],
            'description' => $service['description'],
            'durations' => $durations,
        ];
    }

    sendJson([
        'success' => true,
        'message' => 'Services retrieved successfully.',
        'data' => $data
    ]);

} catch (Throwable $exception) {
    error_log(
        'Just Science services API error: ' .
        $exception->getMessage()
    );

    sendJson([
        'success' => false,
        'message' => 'Unable to retrieve services at this time.'
    ], 500);
}
