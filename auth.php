<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    // Redirect to login page if not authenticated
    header("Location: index.html");
    exit();
}
?>