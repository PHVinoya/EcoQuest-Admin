<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$adminName = $data['adminName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$email) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit();
}

global $projectId, $apiKey;

$adminId = $_SESSION['adminId'] ?? null;

if (!$adminId) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit();
}

$url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/admins/$adminId?key=$apiKey";

// Prepare fields
$fields = [
    "username" => ["stringValue" => $username],
    "adminName" => ["stringValue" => $adminName],
    "email" => ["stringValue" => $email]
];

// If password is not empty → hash it
if (!empty($password)) {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $fields["password"] = ["stringValue" => $hashedPassword];
}

// PATCH request
$body = json_encode(["fields" => $fields]);

$options = [
    "http" => [
        "method" => "PATCH",
        "header" => "Content-Type: application/json",
        "content" => $body
    ]
];

$result = file_get_contents($url, false, stream_context_create($options));

if ($result === FALSE) {
    echo json_encode(['success' => false, 'error' => 'Update failed']);
} else {
    echo json_encode(['success' => true]);
}
?>