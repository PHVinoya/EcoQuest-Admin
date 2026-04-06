document.addEventListener("DOMContentLoaded", () => {

    const totalUsersEl = document.getElementById("totalUsers");
    const totalVouchersEl = document.getElementById("totalVouchers");
    

    async function loadStats() {
        try {
            const response = await fetch("api/get_stats.php"); // ⚠️ adjust if needed
            const data = await response.json();

            console.log("API Response:", data); // 🔥 DEBUG

            if (!data.success) {
                console.error("API Error:", data.error);
                totalUsersEl.textContent = "Error";
                totalVouchersEl.textContent = "Error";
                return;
            }

            totalUsersEl.textContent = data.totalUsers;
            totalVouchersEl.textContent = data.totalVouchers;

        } catch (error) {
            console.error("Fetch failed:", error);
            totalUsersEl.textContent = "Error";
            totalVouchersEl.textContent = "Error";
        }
    }

    loadStats();
    
});