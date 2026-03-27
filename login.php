<?php
session_start();

// Fixed credentials
$admin_user = "admin";
$admin_pass = "admin123";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === $admin_user && $password === $admin_pass) {
        // Set session and redirect
        $_SESSION['admin'] = true;
        header("Location: dashboard.php");
        exit();
    } else {
        // Redirect back with error
        header("Location: index.html?error=invalid");
        exit();
    }
} else {
    // Direct access not allowed
    header("Location: index.html");
    exit();
}
?>
Manus