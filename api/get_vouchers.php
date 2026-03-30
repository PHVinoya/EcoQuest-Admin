<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false]);
    exit();
}

$vouchers = getAllVouchers();

echo json_encode(['success' => true, 'vouchers' => $vouchers]);
?>