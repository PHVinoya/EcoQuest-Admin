document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Navigation ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav li[data-page]');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            
            // Update Active State
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show Target Page
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`${targetPage}Page`).classList.add('active');

            // Update Header Title
            pageTitle.textContent = item.querySelector('span').textContent;

            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // --- 2. Dashboard Charts (Chart.js) ---
    const initCharts = () => {
        // User Growth Chart
        const userCtx = document.getElementById('userGrowthChart').getContext('2d');
        new Chart(userCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Users',
                    data: [1200, 1900, 3000, 5000, 8000, 12450],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b3b3b3' } },
                    x: { grid: { display: false }, ticks: { color: '#b3b3b3' } }
                }
            }
        });

        // Voucher Usage Chart
        const voucherCtx = document.getElementById('voucherUsageChart').getContext('2d');
        new Chart(voucherCtx, {
            type: 'bar',
            data: {
                labels: ['Valid', 'Used', 'Expired'],
                datasets: [{
                    label: 'Vouchers',
                    data: [2500, 1500, 560],
                    backgroundColor: ['#2ecc71', '#b3b3b3', '#FF0B55'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#b3b3b3' } },
                    x: { grid: { display: false }, ticks: { color: '#b3b3b3' } }
                }
            }
        });
    };
    initCharts();

    // --- 3. Manage Users Table ---
    const usersData = [
        { email: 'john@example.com', uid: 'EQ-8821', status: 'Active' },
        { email: 'sarah.w@gmail.com', uid: 'EQ-4412', status: 'Suspended' },
        { email: 'mike.eco@outlook.com', uid: 'EQ-9901', status: 'Active' },
        { email: 'lisa.green@eco.org', uid: 'EQ-1123', status: 'Active' },
        { email: 'dev.test@ecoquest.com', uid: 'EQ-0000', status: 'Active' }
    ];

    const populateUsers = () => {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = usersData.map(user => `
            <tr>
                <td>${user.email}</td>
                <td>${user.uid}</td>
                <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn btn-suspend" title="${user.status === 'Active' ? 'Suspend' : 'Unsuspend'}">
                            <i class="fas ${user.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                        </button>
                        <button class="action-btn btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    };
    populateUsers();

    // --- 4. Manage Vouchers Table ---
    const vouchersData = [
        { code: 'ECO-SAVE-20', user: 'john@example.com', status: 'Valid', expiry: '2026-12-31' },
        { code: 'GREEN-QUEST-50', user: 'sarah.w@gmail.com', status: 'Used', expiry: '2026-05-15' },
        { code: 'PLANT-TREE-10', user: 'mike.eco@outlook.com', status: 'Expired', expiry: '2025-10-01' }
    ];

    const populateVouchers = () => {
        const tbody = document.querySelector('#vouchersTable tbody');
        tbody.innerHTML = vouchersData.map(v => `
            <tr>
                <td><strong>${v.code}</strong></td>
                <td>${v.user}</td>
                <td><span class="status-badge status-${v.status.toLowerCase()}">${v.status}</span></td>
                <td>${v.expiry}</td>
                <td>
                    <div class="action-btns">
                        ${v.status === 'Valid' ? `<button class="action-btn btn-use" title="Mark as Used"><i class="fas fa-check"></i></button>` : ''}
                        <button class="action-btn btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    };
    populateVouchers();

    // --- 5. Voucher Validation Modal ---
    const modal = document.getElementById('voucherModal');
    const validateBtn = document.getElementById('validateVoucherBtn');
    const closeBtn = document.querySelector('.close-btn');
    const checkBtn = document.getElementById('checkVoucherBtn');
    const voucherInput = document.getElementById('voucherCodeInput');
    const voucherResult = document.getElementById('voucherResult');

    validateBtn.onclick = () => modal.classList.add('show');
    closeBtn.onclick = () => {
        modal.classList.remove('show');
        voucherResult.style.display = 'none';
        voucherInput.value = '';
    };

    checkBtn.onclick = () => {
        const code = voucherInput.value.trim().toUpperCase();
        voucherResult.style.display = 'block';
        
        if (code === 'ECO-SAVE-20') {
            voucherResult.innerHTML = '<span style="color: #2ecc71">Voucher is VALID and ready to use!</span>';
            voucherResult.className = 'voucher-result status-valid';
        } else if (code === 'GREEN-QUEST-50') {
            voucherResult.innerHTML = '<span style="color: #b3b3b3">Voucher has already been USED.</span>';
            voucherResult.className = 'voucher-result status-used';
        } else {
            voucherResult.innerHTML = '<span style="color: #FF0B55">Voucher is EXPIRED or INVALID.</span>';
            voucherResult.className = 'voucher-result status-expired';
        }
    };

    // --- 6. App Update Form ---
    const appForm = document.getElementById('appUpdateForm');
    const apkInput = document.getElementById('apkInput');
    const uploadStatus = document.getElementById('uploadStatus');

    appForm.onsubmit = (e) => {
        e.preventDefault();
        if (!apkInput.files[0]) {
            uploadStatus.textContent = 'Please select an APK file first.';
            uploadStatus.className = 'status-message status-error';
            return;
        }
        
        uploadStatus.textContent = 'Uploading APK and updating landing page...';
        uploadStatus.className = 'status-message status-success';
        
        setTimeout(() => {
            document.getElementById('currentVersion').textContent = 'v1.2.5 (Just Updated)';
            uploadStatus.textContent = 'Success! Landing page download button updated to new version.';
        }, 2000);
    };

    // --- 7. Profile Settings Form ---
    const settingsForm = document.getElementById('settingsForm');
    const settingsStatus = document.getElementById('settingsStatus');

    settingsForm.onsubmit = (e) => {
        e.preventDefault();
        settingsStatus.textContent = 'Saving profile changes...';
        settingsStatus.className = 'status-message status-success';
        
        setTimeout(() => {
            settingsStatus.textContent = 'Profile updated successfully!';
        }, 1500);
    };

    // --- 8. Authentication & Logout ---
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    };

    // Simple Session Check
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        alert('Please login first.');
        window.location.href = 'index.html';
    }
});