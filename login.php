<?php
session_start();
require 'firestore.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $user = getUserByUsername($username);

    if ($user && $user['password'] === $password) {
        $_SESSION['username'] = $username;
        echo json_encode(['success' => true, 'redirect' => 'dashboard.php']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    }
    exit();
}
?>