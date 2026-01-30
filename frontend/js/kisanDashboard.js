const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
const recentOrdersDiv = document.getElementById("recentOrders");

// 1. Authentication Check
if (!userId || role !== "kisan") {
  window.location.href = "../login.html";
}

// 2. Load Stats (Products, Orders, Earnings)
async function loadStats() {
  try {
    // Fetching orders to calculate stats locally based on orderController logic
    const response = await fetch(
      `http://localhost:5000/api/orders/kisan/${userId}`,
    );
    const data = await response.json();
    const orders = data.orders || [];

    // Update Orders Received
    document.getElementById("ordersReceived").innerText = orders.length;

    // Update Pending Orders
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    document.getElementById("ordersPending").innerText = pendingCount;

    // Update Total Earnings (Sum of Delivered orders)
    const totalEarnings = orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    document.getElementById("earnings").innerText = "₹ " + totalEarnings;

    // Fetch Total Products from product API
    const prodResponse = await fetch(
      `http://localhost:5000/api/products/my-products/${userId}`,
    );
    const prodData = await prodResponse.json();
    document.getElementById("totalProducts").innerText =
      prodData.products?.length || 0;
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
}

// 3. Load Recent Orders
async function loadRecentsOrders() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/kisan/${userId}`,
    );
    const data = await response.json();

    recentOrdersDiv.innerHTML = "";

    if (!data.orders || data.orders.length === 0) {
      recentOrdersDiv.innerHTML = "<li>No recent orders</li>";
      return;
    }

    // Displaying top 5 most recent orders
    data.orders.slice(0, 5).forEach((order) => {
      const items = order.items
        .map((i) => `${i.name} (${i.quantity})`)
        .join(", ");

      const li = document.createElement("li");
      li.style.padding = "10px 0";
      li.style.borderBottom = "1px solid #eee";

      li.innerHTML = `
                <strong>${order.buyerId?.name || "Buyer"}</strong><br>
                <small>${items}</small><br>
                <span>₹${order.totalAmount}</span> 
                <span class="status-badge status-${order.status.toLowerCase()}">
                   ${order.status}
                </span>
            `;

      recentOrdersDiv.appendChild(li);
    });
  } catch (error) {
    recentOrdersDiv.innerHTML = "<li>Failed to load orders</li>";
  }
}

// 4. Weather Logic
async function loadWeather() {
  const weatherDiv = document.getElementById("weatherContent");
  // Fallback to 'Mumbai' if city is not set in localStorage
  const city = localStorage.getItem("city") || "Mumbai";

  try {
    const response = await fetch(
      `http://localhost:5000/api/kisan/weather/${city}`,
    );
    const data = await response.json();

    weatherDiv.innerHTML = `
            <p><b>Location:</b> ${data.city}</p>
            <p><b>Condition:</b> ${data.description}</p>
            <p><b>Temperature:</b> ${data.temp}°C</p>
            <p><b>Humidity:</b> ${data.humidity}%</p>
        `;
  } catch (err) {
    weatherDiv.innerHTML = "<p>Weather data unavailable.</p>";
  }
}

// 5. Crop Recommendation Logic
async function getRecommendation() {
  const soilType = document.getElementById("soilType").value;
  const season = document.getElementById("season").value;
  const resultText = document.getElementById("recommendationResult");

  if (!soilType || !season) {
    resultText.innerText = "Please select both options.";
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/kisan/recommend-crop",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soilType, season }),
      },
    );
    const data = await response.json();
    resultText.innerText = "Recommended: " + data.recommendedCrop;
  } catch (err) {
    resultText.innerText = "Failed to get advice.";
  }
}

// 6. Refresh Listener
setInterval(() => {
  if (localStorage.getItem("refreshDashboard") === "true") {
    loadStats();
    loadRecentsOrders();
    localStorage.removeItem("refreshDashboard");
  }
}, 1000);

// 7. Initial Page Load
document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadRecentsOrders();
  loadWeather();
});

// 8. Event Listeners
document
  .getElementById("getAdviceBtn")
  .addEventListener("click", getRecommendation);
