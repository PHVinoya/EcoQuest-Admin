<?php include 'auth.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoQuest Admin | Dashboard</title>
    <link rel="stylesheet" href="admin-style.css">
    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="admin-body">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <span>EcoQuest Admin</span>
            </div>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li class="active" data-page="dashboard">
                    <a href="#"><i class="fas fa-th-large"></i> <span>Dashboard</span></a>
                </li>
                <li data-page="users">
                    <a href="#"><i class="fas fa-users"></i> <span>Manage Users</span></a>
                </li>
                <li data-page="vouchers">
                    <a href="#"><i class="fas fa-ticket-alt"></i> <span>Manage Vouchers</span></a>
                </li>
                <li data-page="app-page">
                    <a href="#"><i class="fas fa-mobile-alt"></i> <span>App Page</span></a>
                </li>
                <li data-page="settings">
                    <a href="#"><i class="fas fa-cog"></i> <span>Profile Settings</span></a>
                </li>
                <li class="logout-item">
                    <a href="logout.php" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> <span>Logout</span></a>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
            <div class="header-left">
                <div class="menu-toggle"><i class="fas fa-bars"></i></div>
                <h2 id="pageTitle">Dashboard</h2>
            </div>
            
        </header>

        <!-- Dynamic Content Area -->
        <div id="contentArea" class="content-area">
            <!-- Dashboard Page (Default) -->
            <div id="dashboardPage" class="page active">
                <div class="stats-grid">
                    <div class="stat-card glass-morphism">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-info">
                            <h3>Total Users</h3>
                            <p class="stat-value" id="totalUsers">Loading...</p>
                        </div>
                    </div>
                    <div class="stat-card glass-morphism">
                        <div class="stat-icon"><i class="fas fa-download"></i></div>
                        <div class="stat-info">
                            <h3>App Downloads</h3>
                            <p class="stat-value" id="totalDownloads">Loading...</p>
                        </div>
                    </div>
                    <div class="stat-card glass-morphism">
                        <div class="stat-icon"><i class="fas fa-ticket-alt"></i></div>
                        <div class="stat-info">
                            <h3>Vouchers Generated</h3>
                            <p class="stat-value" id="totalVouchers">Loading...</p>
                        </div>
                    </div>
                </div>
                <div class="charts-grid">
                    <div class="chart-container glass-morphism">
                        <h3>User Growth</h3>
                        <canvas id="userGrowthChart"></canvas>
                    </div>
                    <div class="chart-container glass-morphism">
                        <h3>Voucher Usage</h3>
                        <canvas id="voucherUsageChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Manage Users Page -->
            <div id="usersPage" class="page">
                <div class="table-controls glass-morphism">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="userSearch" placeholder="Search users by email">
                    </div>
                    <button class="btn secondary-btn refresh-btn" id="refreshUsersBtn">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
                <div class="table-container glass-morphism">
                    <table id="usersTable">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>UID</th>
                                <th>Coins</th>
                                <th>Points</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Populated by Firebase -->
                        </tbody>
                    </table>
                    <div class="pagination">
                        <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
                        <span class="page-info">Page 1 of 1</span>
                        <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>

            <!-- Manage Vouchers Page -->
            <div id="vouchersPage" class="page">
                <div class="table-controls glass-morphism">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="voucherSearch" placeholder="Search vouchers...">
                    </div>
                    <div class="control-buttons">
                        <button class="btn secondary-btn refresh-btn" id="refreshVouchersBtn">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                        
                    </div>
                </div>
                <div class="table-container glass-morphism">
                    <table id="vouchersTable">
                        <thead>
                            <tr>
                                <th>Voucher Code</th>
                                <th>User</th>
                                <th>Reward</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                        <tbody>
                            <!-- Populated by Firebase -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- App Page -->
            <div id="appPage" class="page">
                <div class="app-update-container glass-morphism">
                    <h3>Update App Version</h3>
                    <div class="current-version">
                        <span>Current Version:</span>
                        <strong id="currentVersion">Loading...</strong>
                    </div>
                    <form id="appUpdateForm">
                        <div class="input-group">
                            <label>Upload APK File</label>
                            <div class="file-upload-wrapper">
                                <input type="file" id="apkInput" accept=".apk">
                                <div class="file-upload-info">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Click or drag APK file here</p>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn primary-btn">Update Landing Page</button>
                    </form>
                    <div id="uploadStatus" class="status-message"></div>
                </div>
            </div>

            <!-- Profile Settings Page -->
            <div id="settingsPage" class="page">
                <div class="settings-container glass-morphism">
                    <h3>Profile Settings</h3>
                    <form id="settingsForm">
                        <div class="input-group">
                            <label>Full Name</label>
                            <input type="text" id="adminName" value="Admin" required>
                        </div>
                        <div class="input-group">
                            <label>Email Address</label>
                            <input type="email" id="adminEmail" value="admin@ecoquest.com" required>
                        </div>
                        <div class="input-group">
                            <label>New Password</label>
                            <input type="password" id="adminPassword" placeholder="Leave blank to keep current">
                        </div>
                        <button type="submit" class="btn primary-btn">Save Changes</button>
                    </form>
                    <div id="settingsStatus" class="status-message"></div>
                </div>
            </div>
        </div>
    </main>

    <!-- Edit User Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content glass-morphism edit-modal-content">
            <span class="close-btn" id="closeEditModal">&times;</span>
            <div class="modal-inner">
                <h3>Edit User</h3>

                <input type="hidden" id="editUserId">

                <div class="input-group">
                    <label>Coins</label>
                    <input type="number" id="editCoins">
                </div>

                <div class="input-group">
                    <label>Points</label>
                    <input type="number" id="editPoints">
                </div>

                <button class="btn primary-btn" id="saveUserBtn">Save Changes</button>
            </div>
        </div>
    </div>
    <!-- Delete User Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content glass-morphism delete-modal-content">
            <div class="modal-inner">
                <h3>Delete User?</h3>
                <p>This action cannot be undone.</p>

                <input type="hidden" id="deleteUserId">

            <div class="actions">
                <button class="btn danger-btn" id="confirmDelete">Delete</button>
                <button class="btn" id="cancelDelete">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Delete Voucher Modal -->
    <div id="deleteVoucherModal" class="modal">
        <div class="modal-content glass-morphism">
            <span class="close-btn" id="closeDeleteVoucherModal">&times;</span>
            <div class="modal-inner">
                <h3>Delete Voucher</h3>
                <p>Are you sure you want to delete this voucher?</p>

                <input type="hidden" id="deleteVoucherId">
                <input type="hidden" id="deleteVoucherUserId">

                <div style="margin-top: 15px;">
                    <button class="btn secondary-btn" id="cancelDeleteVoucher">Cancel</button>
                    <button class="btn danger-btn" id="confirmDeleteVoucher">Delete</button>
                </div>
            </div>
        </div>
    </div>
        
    <script type="module" src="admin-script.js"></script>
</body>
</html>