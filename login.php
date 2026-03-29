<?php
session_start();
require 'firestore.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Please enter username and password']);
        exit();
    }

    // ✅ Use the correct function for admins
    $user = getAdminByUsername($username);

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
        exit();
    }

    // Check password
    // If your Firestore stores hashed passwords
    if (password_verify($password, $user['password'])) {
        $_SESSION['username'] = $username;
        echo json_encode(['success' => true, 'redirect' => 'dashboard.php']);
    } 
    // If your Firestore stores plain text passwords (temporary)
    // else if ($password === $user['password']) {
    //     $_SESSION['username'] = $username;
    //     echo json_encode(['success' => true, 'redirect' => 'dashboard.php']);
    // }
    else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    }

    exit();
}
?>