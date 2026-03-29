<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$uid = $data['uid'] ?? null;
$coins = $data['coins'] ?? null;
$points = $data['points'] ?? null;

if (!$uid) {
    echo json_encode(['success' => false, 'error' => 'Missing UID']);
    exit();
}

global $projectId, $apiKey;

$url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$uid?updateMask.fieldPaths=coins&updateMask.fieldPaths=points&key=$apiKey";

$body = json_encode([
    "fields" => [
        "coins" => ["integerValue" => (int)$coins],
        "points" => ["integerValue" => (int)$points]
    ]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode >= 400) {
    echo json_encode(['success' => false, 'error' => $response ?: 'Unknown error']);
    exit();
}

// Firestore returns the updated document in response
$resData = json_decode($response, true);
if (isset($resData['fields'])) {
    echo json_encode([
        'success' => true,
        'updated' => [
            'coins' => $resData['fields']['coins']['integerValue'] ?? 0,
            'points' => $resData['fields']['points']['integerValue'] ?? 0
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update']);
}