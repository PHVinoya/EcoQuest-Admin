<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$uid = $data['uid'] ?? null;

if (!$uid) {
    echo json_encode(['success' => false, 'error' => 'Missing UID']);
    exit();
}

global $projectId, $apiKey;

$url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$uid?key=$apiKey";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['success' => false, 'error' => curl_error($ch)]);
} else {
    echo json_encode(['success' => true]);
}

curl_close($ch);
?>