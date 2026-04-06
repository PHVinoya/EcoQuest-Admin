<?php

// 📁 Path to APK file
$filePath = __DIR__ . "/App/ecoquest1.apk";

// ❌ Check if file exists
if (!file_exists($filePath)) {
    http_response_code(404);
    echo "APK file not found.";
    exit();
}

// 📦 File info
$fileName = "ecoquest1.apk";
$fileSize = filesize($filePath);

// 🔽 Force download headers
header("Content-Description: File Transfer");
header("Content-Type: application/vnd.android.package-archive");
header("Content-Disposition: attachment; filename=\"$fileName\"");
header("Content-Length: " . $fileSize);
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: public");
header("Expires: 0");

// 🧹 Clean output buffer (avoid corruption)
if (ob_get_level()) {
    ob_end_clean();
}
flush();

// 📤 Output file
readfile($filePath);
exit();
?>