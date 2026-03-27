// Firebase v9 Modular SDK Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- YOUR FIREBASE CONFIGURATION ---
// Replace this with your actual Firebase project config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`${targetPage}Page`).classList.add('active');
            pageTitle.textContent = item.querySelector('span').textContent;
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // --- 2. Real-time Data Sync (Firestore) ---
    
    // Sync Stats
    onSnapshot(collection(db, "stats"), (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (document.getElementById('totalUsers')) document.getElementById('totalUsers').textContent = data.totalUsers.toLocaleString();
            if (document.getElementById('totalDownloads')) document.getElementById('totalDownloads').textContent = data.totalDownloads.toLocaleString();
            if (document.getElementById('totalVouchers')) document.getElementById('totalVouchers').textContent = data.totalVouchers.toLocaleString();
        });
    });

    // Sync Users Table
    const usersTbody = document.querySelector('#usersTable tbody');
    onSnapshot(collection(db, "users"), (snapshot) => {
        usersTbody.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const user = docSnap.data();
            const id = docSnap.id;
            const row = `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.uid}</td>
                    <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn btn-suspend" onclick="toggleUserStatus('${id}', '${user.status}')">
                                <i class="fas ${user.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteUser('${id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            usersTbody.insertAdjacentHTML('beforeend', row);
        });
    });

    // Sync Vouchers Table
    const vouchersTbody = document.querySelector('#vouchersTable tbody');
    onSnapshot(collection(db, "vouchers"), (snapshot) => {
        vouchersTbody.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const v = docSnap.data();
            const id = docSnap.id;
            const row = `
                <tr>
                    <td><strong>${v.code}</strong></td>
                    <td>${v.user}</td>
                    <td><span class="status-badge status-${v.status.toLowerCase()}">${v.status}</span></td>
                    <td>${v.expiry}</td>
                    <td>
                        <div class="action-btns">
                            ${v.status === 'Valid' ? `<button class="action-btn btn-use" onclick="markVoucherUsed('${id}')"><i class="fas fa-check"></i></button>` : ''}
                            <button class="action-btn btn-delete" onclick="deleteVoucher('${id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            vouchersTbody.insertAdjacentHTML('beforeend', row);
        });
    });

    // --- 3. Firestore Actions ---
    window.toggleUserStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        await updateDoc(doc(db, "users", id), { status: newStatus });
    };

    window.deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteDoc(doc(db, "users", id));
        }
    };

    window.markVoucherUsed = async (id) => {
        await updateDoc(doc(db, "vouchers", id), { status: 'Used' });
    };

    window.deleteVoucher = async (id) => {
        if (confirm('Are you sure you want to delete this voucher?')) {
            await deleteDoc(doc(db, "vouchers", id));
        }
    };

    // --- 4. Dashboard Charts (Chart.js) ---
    const initCharts = () => {
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
});