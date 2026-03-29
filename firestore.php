<?php
// firestore.php

$projectId = "ecoquest-ar";
$apiKey = "AIzaSyAwrqK_cyeGrI1C02bgyv1zJ2AgRwVkd1s";

// --- Admin login ---
function getAdminByUsername($username) {
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

// --- Fetch all users for Manage Users page ---
function getAllUsers() {
    global $projectId, $apiKey;

    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users?key=$apiKey";
    $response = @file_get_contents($url);

    if (!$response) {
        return ['error' => 'Could not fetch users from Firestore'];
    }

    $data = json_decode($response, true);
    if (!isset($data['documents'])) return [];

    $users = [];
    foreach ($data['documents'] as $doc) {
        $fields = $doc['fields'];

        // Extract UID from full document path
        $parts = explode('/', $doc['name']);
        $uid = end($parts);

        $users[] = [
            'uid' => $uid,
            'email' => $fields['email']['stringValue'] ?? '',
            'points' => isset($fields['points']['integerValue']) ? (int)$fields['points']['integerValue'] : 0,
            'coins' => isset($fields['coins']['integerValue']) ? (int)$fields['coins']['integerValue'] : 0
        ];
    }

    return $users;
}
?>  