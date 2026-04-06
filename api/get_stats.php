<?php
session_start();
require '../firestore.php';

header('Content-Type: application/json');

// Log for debugging
error_log("=== get_stats.php called ===");

// Try to fetch all users
try {
    error_log("Fetching users...");
    $users = getAllUsers();
    error_log("Users result type: " . gettype($users));
    error_log("Users result: " . json_encode($users));
    
    // Handle errors
    if (isset($users['error'])) {
        error_log("Error fetching users: " . $users['error']);
        echo json_encode(['success' => false, 'error' => "Users: " . $users['error']]);
        exit();
    }
    
    // Fetch all vouchers
    error_log("Fetching vouchers...");
    $vouchers = getAllVouchers();
    error_log("Vouchers result type: " . gettype($vouchers));
    
    if (isset($vouchers['error'])) {
        $voucherCount = 0;
        error_log("Error fetching vouchers: " . $vouchers['error']);
    } else {
        $voucherCount = count($vouchers);
        error_log("Voucher count: " . $voucherCount);
    }
    
    // Get counts
    $userCount = count($users);
    error_log("User count: " . $userCount);
    
    // Return JSON
    error_log("Returning success response");
    echo json_encode([
        'success' => true, 
        'totalUsers' => $userCount,
        'totalVouchers' => $voucherCount
    ]);
} catch (Exception $e) {
    error_log("Exception: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => "Exception: " . $e->getMessage()
    ]);
}

?>
