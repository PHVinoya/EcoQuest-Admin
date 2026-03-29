<?php
// firestore.php

// Your Firebase project ID
$projectId = "ecoquest-ar";

// Your Firestore Web API Key (found in Project Settings -> General -> Web API Key)
$apiKey = "AIzaSyAwrqK_cyeGrI1C02bgyv1zJ2AgRwVkd1s";

function getUserByUsername($username) {
    global $projectId, $apiKey;

    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/admins?key=$apiKey";

    $response = @file_get_contents($url);
    if (!$response) return null;

    $data = json_decode($response, true);
    if (!isset($data['documents'])) return null;

    foreach ($data['documents'] as $doc) {
        $fields = $doc['fields'];
        if (isset($fields['username']['stringValue']) && $fields['username']['stringValue'] === $username) {
            return [
                'username' => $fields['username']['stringValue'],
                'password' => $fields['password']['stringValue'] ?? ''
            ];
        }
    }
    return null;
}
?>