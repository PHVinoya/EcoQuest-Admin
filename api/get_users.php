<?php
session_start();
require '../firestore.php'; // adjust path if needed

header('Content-Type: application/json');

// Protect endpoint
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

// Fetch all users
$users = getAllUsers();

// Handle errors
if (isset($users['error'])) {
    echo json_encode(['success' => false, 'error' => $users['error']]);
    exit();
}

// Return JSON
echo json_encode(['success' => true, 'users' => $users]);
?>