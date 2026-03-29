<?php
session_start();

// Check if admin is logged in using the new session variable
if (!isset($_SESSION['username'])) {
    // Redirect to login page if not authenticated
    header("Location: index.php");
    exit();
}
?>