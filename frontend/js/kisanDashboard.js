const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
const recentOrdersDiv = document.getElementById("recentOrders");

if (!userId || !role) {
  window.location.href = "./login.html";
}

async function loadStats() {
  const response = await fetch(
    `http://localhost:5000/api/kisan/dashboard/${userId}`,
  );

  const data = await response.json();

  document.getElementById("totalProducts").innerText = data.totalProducts;

  document.getElementById("ordersReceived").innerText = data.ordersReceived;

  document.getElementById("ordersPending").innerText = data.pendingOrders;

  document.getElementById("earnings").innerText = "₹ " + data.earnings;
}

loadStats();

async function loadRecentsOrders() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/recent/${userId}`,
    );

    const data = await response.json();

    recentOrdersDiv.innerHTML = "";

    if (data.orders.length === 0) {
      recentOrdersDiv.innerHTML = "<li>No recent orders</li>";
      return;
    }

    data.orders.forEach((order) => {
      const items = order.items
        .map((i) => `${i.name} (${i.quantity})`)
        .join(", ");

      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${order.buyerId?.name || "Buyer"}</strong><br>
        ${items} <br>
        ₹${order.totalAmount} 
        <span class="status ${order.status.toLowerCase()}">
           ${order.status}
        </span>
        `;

      recentOrdersDiv.appendChild(li);
    });
  } catch (error) {
    recentOrdersDiv.innerHTML = "<li>Failed to load orders</li>";
  }
}

loadRecentsOrders();

setInterval(() => {
  const refresh = localStorage.getItem("refreshDashboard");

  if (refresh === "true") {
    loadStats();
    localStorage.removeItem("refreshDashboard");
  }
}, 1000);
