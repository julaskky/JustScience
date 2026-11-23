<?php

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

configureApi();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST, OPTIONS');

    sendJson([
        'success' => false,
        'message' => 'Only POST requests are allowed.'
    ], 405);
}

$rawInput = file_get_contents('php://input');

$data = json_decode($rawInput ?: '', true);

if (!is_array($data)) {
    sendJson([
        'success' => false,
        'message' => 'Invalid registration information.'
    ], 400);
}

/*
|--------------------------------------------------------------------------
| Basic spam protection
|--------------------------------------------------------------------------
| The website form includes a hidden website field.
| Real visitors should leave it empty.
*/

if (!empty($data['website'] ?? '')) {
    sendJson([
        'success' => true,
        'message' => 'Your registration has been received.'
    ]);
}

/*
|--------------------------------------------------------------------------
| Course catalogue and authoritative prices
|--------------------------------------------------------------------------
*/

$courses = [
    'website-design' => [
        'title' => 'Website Design',
        'prices' => [
            '1 Week' => 49,
            '2 Weeks' => 89,
            '1 Month' => 149,
            '3 Months' => 349,
        ],
    ],

    'python-programming' => [
        'title' => 'Python Programming',
        'prices' => [
            '1 Week' => 59,
            '2 Weeks' => 109,
            '1 Month' => 189,
            '3 Months' => 449,
        ],
    ],

    'machine-learning' => [
        'title' => 'Machine Learning',
        'prices' => [
            '1 Week' => 79,
            '2 Weeks' => 149,
            '1 Month' => 249,
            '3 Months' => 599,
        ],
    ],

    'artificial-intelligence' => [
        'title' => 'Artificial Intelligence',
        'prices' => [
            '1 Week' => 69,
            '2 Weeks' => 129,
            '1 Month' => 219,
            '3 Months' => 529,
        ],
    ],

    'deep-learning' => [
        'title' => 'Deep Learning',
        'prices' => [
            '1 Week' => 89,
            '2 Weeks' => 169,
            '1 Month' => 289,
            '3 Months' => 699,
        ],
    ],

    'natural-language-processing' => [
        'title' => 'Natural Language Processing',
        'prices' => [
            '1 Week' => 79,
            '2 Weeks' => 149,
            '1 Month' => 259,
            '3 Months' => 629,
        ],
    ],

    'large-language-models' => [
        'title' => 'Large Language Models',
        'prices' => [
            '1 Week' => 89,
            '2 Weeks' => 169,
            '1 Month' => 289,
            '3 Months' => 699,
        ],
    ],
];

/*
|--------------------------------------------------------------------------
| Read and validate fields
|--------------------------------------------------------------------------
*/

$fullName = trim((string) ($data['full_name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$country = trim((string) ($data['country'] ?? ''));
$courseSlug = trim((string) ($data['course_slug'] ?? ''));
$duration = trim((string) ($data['duration'] ?? ''));
$experience = trim((string) ($data['experience_level'] ?? ''));
$goals = trim((string) ($data['learning_goals'] ?? ''));

if ($fullName === '' || mb_strlen($fullName) < 2 || mb_strlen($fullName) > 150) {
    sendJson([
        'success' => false,
        'message' => 'Please enter your full name.'
    ], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    sendJson([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ], 422);
}

if (mb_strlen($phone) > 40 || mb_strlen($country) > 100) {
    sendJson([
        'success' => false,
        'message' => 'Some contact information is too long.'
    ], 422);
}

if (!isset($courses[$courseSlug])) {
    sendJson([
        'success' => false,
        'message' => 'The selected course is not available.'
    ], 422);
}

if (!isset($courses[$courseSlug]['prices'][$duration])) {
    sendJson([
        'success' => false,
        'message' => 'Please select a valid course duration.'
    ], 422);
}

$allowedExperience = [
    '',
    'Beginner',
    'Intermediate',
    'Advanced',
];

if (!in_array($experience, $allowedExperience, true)) {
    sendJson([
        'success' => false,
        'message' => 'Please select a valid experience level.'
    ], 422);
}

if (mb_strlen($goals) > 3000) {
    sendJson([
        'success' => false,
        'message' => 'Your learning goals must not exceed 3000 characters.'
    ], 422);
}

/*
|--------------------------------------------------------------------------
| Use server-side course information and price
|--------------------------------------------------------------------------
*/

$courseTitle = $courses[$courseSlug]['title'];
$price = $courses[$courseSlug]['prices'][$duration];

$reference = 'JS-' .
    date('Ymd') . '-' .
    strtoupper(bin2hex(random_bytes(4)));

/*
|--------------------------------------------------------------------------
| Save enrolment
|--------------------------------------------------------------------------
*/

try {
    $pdo = getDatabase();

    $sql = "
        INSERT INTO course_enrollments (
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
            learning_goals
        ) VALUES (
            :reference,
            :full_name,
            :email,
            :phone,
            :country,
            :course_slug,
            :course_title,
            :duration,
            :price,
            :experience,
            :goals
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':reference' => $reference,
        ':full_name' => $fullName,
        ':email' => $email,
        ':phone' => $phone !== '' ? $phone : null,
        ':country' => $country !== '' ? $country : null,
        ':course_slug' => $courseSlug,
        ':course_title' => $courseTitle,
        ':duration' => $duration,
        ':price' => $price,
        ':experience' => $experience !== '' ? $experience : null,
        ':goals' => $goals !== '' ? $goals : null,
    ]);

    sendJson([
        'success' => true,
        'message' => 'Your course registration was submitted successfully.',
        'reference' => $reference,
        'registration' => [
            'course' => $courseTitle,
            'duration' => $duration,
            'price' => $price,
            'currency' => 'USD',
            'status' => 'pending',
        ],
    ], 201);

} catch (PDOException $exception) {
    error_log('Just Science enrolment error: ' . $exception->getMessage());

    sendJson([
        'success' => false,
        'message' => 'We could not save your registration at this time. Please try again.'
    ], 500);
}