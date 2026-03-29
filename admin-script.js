// Firebase v9 Modular SDK Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- YOUR FIREBASE CONFIGURATION ---
// Replace this with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAwrqK_cyeGrI1C02bgyv1zJ2AgRwVkd1s",
    authDomain: "ecoquest-ar.firebaseapp.com",
    projectId: "ecoquest-ar",
    storageBucket: "ecoquest-ar.firebasestorage.app",
    messagingSenderId: "150203193691",
    appId: "1:150203193691:web:0d3b1fc1033505a272a27e"
};


//edit modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const uid = e.target.dataset.id;

        document.getElementById('editUserId').value = uid;

        // Optional: prefill values from row
        const row = e.target.closest('tr');
        document.getElementById('editCoins').value = row.children[2].innerText;
        document.getElementById('editPoints').value = row.children[3].innerText;

        document.getElementById('editModal').classList.add('show');
    }
});




// Fetch and populate Manage Users table
async function loadUsers() {

    

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const res = await fetch('api/get_users.php', {
            method: 'GET',
            credentials: 'include' // send session cookie
        });
        const data = await res.json();

        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="4">${data.error}</td></tr>`;
            return;
        }

        const users = data.users;
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.email}</td>
                <td>${user.uid}</td>
                <td><span class="badge coins">${user.coins}</span></td>
                <td><span class="badge points">${user.points}</span></td>
                <td>
                    <button class="btn edit-btn" data-id="${user.uid}">Edit</button>
                    <button class="btn delete-btn" data-id="${user.uid}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="4">Failed to load users</td></tr>';
    }
    
    let usersData = []; // store users globally

    function sortUsers(type) {
        usersData.sort((a, b) => b[type] - a[type]);
        renderUsers(usersData);
    }
}



// Call it when "Manage Users" page is clicked
document.querySelector('[data-page="users"]').addEventListener('click', loadUsers);

//pagination
const searchInput = document.querySelector('#userSearch');
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('#usersTable tbody tr').forEach(row => {
        const username = row.children[0].textContent.toLowerCase();
        row.style.display = username.includes(query) ? '' : 'none';
    });
});

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
    const voucherModal = document.getElementById('voucherModal');
    const validateBtn = document.getElementById('validateVoucherBtn');
    const voucherCloseBtn = document.querySelector('#voucherModal .close-btn');
    const checkBtn = document.getElementById('checkVoucherBtn');
    const voucherInput = document.getElementById('voucherCodeInput');
    const voucherResult = document.getElementById('voucherResult');

    validateBtn.onclick = () => voucherModal.classList.add('show');
    voucherCloseBtn.onclick = () => {
        voucherModal.classList.remove('show');
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

    // --- 8. Refresh Buttons ---
    const refreshUsersBtn = document.getElementById('refreshUsersBtn');
    const refreshVouchersBtn = document.getElementById('refreshVouchersBtn');

    if (refreshUsersBtn) {
        refreshUsersBtn.addEventListener('click', () => {
            refreshUsersBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshUsersBtn.disabled = true;
            
            // Reload users data
            loadUsers().finally(() => {
                setTimeout(() => {
                    refreshUsersBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                    refreshUsersBtn.disabled = false;
                }, 1000);
            });
        });
    }

    if (refreshVouchersBtn) {
        refreshVouchersBtn.addEventListener('click', () => {
            refreshVouchersBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshVouchersBtn.disabled = true;
            
            // For vouchers, since they use real-time listeners, we'll reload the page
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }
    
});

document.addEventListener('click', async (e) => {
    const target = e.target;

    // EDIT BUTTON
    if (target.classList.contains('edit-btn')) {
        const row = target.closest('tr');
        document.getElementById('editUserId').value = target.dataset.id;
        document.getElementById('editCoins').value = row.children[2].innerText;
        document.getElementById('editPoints').value = row.children[3].innerText;
        document.getElementById('editModal').style.display = 'block';
    }

});

// SAVE CHANGES
document.getElementById('saveUserBtn').addEventListener('click', async () => {
    const uid = document.getElementById('editUserId').value;
    const coins = document.getElementById('editCoins').value;
    const points = document.getElementById('editPoints').value;

    try {
        const res = await fetch('api/update_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, coins, points })
        });
        const data = await res.json();

        if (data.success) {
            alert('✅ User updated!');
            document.getElementById('editModal').style.display = 'none';
            loadUsers(); // refresh table to show new values
        } else {
            alert('❌ ' + (data.error || 'Update failed'));
        }
    } catch (err) {
        console.error(err);
        alert('❌ Request failed');
    }
});

// Close Edit User Modal
  const editModal = document.getElementById('editModal');
  const closeEditBtn = document.getElementById('closeEditModal');

  // When the close button is clicked
  closeEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
  });

  // Optional: close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
      if (e.target === editModal) {
          editModal.style.display = 'none';
      }
  });

  document.addEventListener('click', (e) => {
    // DELETE BUTTON
    if (e.target.classList.contains('delete-btn')) {
        const uid = e.target.dataset.id; // get UID from button
        document.getElementById('deleteUserId').value = uid; // put in hidden input
        document.getElementById('deleteModal').style.display = 'block'; // show modal
    }
});

// CANCEL BUTTON
document.getElementById('cancelDelete').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none';
});

// OPTIONAL: click outside modal content
window.addEventListener('click', (e) => {
    const deleteModal = document.getElementById('deleteModal');
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});

document.getElementById('confirmDelete').addEventListener('click', async () => {
    const uid = document.getElementById('deleteUserId').value;
    if (!uid) return alert('No user selected');

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const res = await fetch('api/delete_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid })
        });
        const data = await res.json();
        if (data.success) {
            alert('✅ User deleted');
            document.getElementById('deleteModal').style.display = 'none';
            loadUsers(); // reload table
        } else {
            alert('❌ Delete failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        console.error(err);
        alert('❌ Request failed');
    }
});
