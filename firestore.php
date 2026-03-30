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
function getAllVouchers() {
    global $projectId, $apiKey;

    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users?key=$apiKey";
    $response = @file_get_contents($url);
    if (!$response) return [];

    $data = json_decode($response, true);
    if (!isset($data['documents'])) return [];

    $vouchers = [];

    foreach ($data['documents'] as $userDoc) {
        $userFields = $userDoc['fields'] ?? [];
        $userEmail = $userFields['email']['stringValue'] ?? 'No Email';
        $userIdParts = explode('/', $userDoc['name']);
        $userId = end($userIdParts);

        // fetch vouchers subcollection
        $vouchersUrl = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$userId/vouchers?key=$apiKey";
        $vRes = @file_get_contents($vouchersUrl);
        if (!$vRes) continue;

        $vData = json_decode($vRes, true);
        if (!isset($vData['documents'])) continue;

        foreach ($vData['documents'] as $voucherDoc) {
            $fields = $voucherDoc['fields'] ?? [];
            $voucherIdParts = explode('/', $voucherDoc['name']);
            $voucherId = end($voucherIdParts);

            // ✅ Correct voucher code field
            $voucherCode = $fields['code']['stringValue'] ?? '';
            $rewardName = $fields['rewardName']['stringValue'] ?? '';

            // handle expiry
            $expiryDate = '';
            if (isset($fields['expiryDate']['stringValue'])) {
                $expiryDate = $fields['expiryDate']['stringValue'];
            } elseif (isset($fields['expiryDate']['timestampValue'])) {
                $expiryDate = date('Y-m-d', strtotime($fields['expiryDate']['timestampValue']));
            }

            $isUsed = $fields['isUsed']['booleanValue'] ?? false;

            $today = date('Y-m-d');
            if ($isUsed) {
                $status = "Used";
            } elseif ($expiryDate <= $today) {
                $status = "Expired";
            } else {
                $status = "Valid";
            }

            $vouchers[] = [
                'id' => $voucherId,
                'userId' => $userId,
                'code' => $voucherCode,  // ✅ now correctly comes from "code"
                'email' => $userEmail,
                'reward' => $rewardName,
                'expiry' => $expiryDate,
                'status' => $status
            ];
        }
    }

    return $vouchers;
}
?>  