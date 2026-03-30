<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$userId = $data['userId'] ?? null;

if (!$id || !$userId) {
    echo json_encode(['success' => false, 'error' => 'Missing data']);
    exit();
}

global $projectId, $apiKey;

// ✅ correct nested path
$url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$userId/vouchers/$id?updateMask.fieldPaths=isUsed&key=$apiKey";

$body = json_encode([
    "fields" => [
        "isUsed" => ["booleanValue" => true]
    ]
]);

$options = [
    "http" => [
        "method" => "PATCH",
        "header" => "Content-Type: application/json",
        "content" => $body
    ]
];

$result = file_get_contents($url, false, stream_context_create($options));

echo json_encode(['success' => $result ? true : false]);
?>