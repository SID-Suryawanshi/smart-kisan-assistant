const kisanId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
const table = document.getElementById("ordersTable");

if (!kisanId || role !== "kisan") {
  window.location.href = "../login.html";
}

async function loadOrders() {
  table.innerHTML = "<tr><td colspan='6'>Loading orders...</td></tr>";

  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/kisan/${kisanId}`,
    );

    const data = await response.json();

    if (data.orders.length === 0) {
      table.innerHTML = "<tr><td colspan='6'>No orders received yet</td></tr>";
      return;
    }

    let rows = "";

    data.orders.forEach((order) => {
      const items = order.items
        .map((i) => `${i.name} (${i.quantity})`)
        .join("<br>");

      let actionBtn = "";

      if (order.status === "Pending") {
        actionBtn = `
        <button type="button" class="accept action-btn" data-id="${order._id}" data-status="Accepted">
          Accept
        </button>`;
      } else if (order.status === "Accepted") {
        actionBtn = `
        <button type="button" class="deliver action-btn" data-id="${order._id}" data-status="Delivered">
          Delivered
        </button>`;
      }

      const statusBadge = `
        <span class="status ${order.status.toLowerCase()}">
          ${order.status}
        </span>
    `;

      rows += `
      <tr>
        <td>${order.buyerId?.name || "Buyer"}</td>
        <td>${items}</td>
        <td>₹ ${order.totalAmount}</td>
        <td>${statusBadge}</td>
        <td>${actionBtn || "-"}</td>
      </tr>
    `;
    });

    table.innerHTML = rows;
  } catch (error) {
    table.innerHTML = "<tr><td colspan='6'>Failed to load orders</td></tr>";
  }
}

async function updateStatus(orderId, status) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update status");
    }

    await loadOrders();

    refreshDashboardStats();
  } catch (error) {
    console.log("Update Error : ", error);
    alert("Could not update order : " + error.message);
  }
}

loadOrders();

table.addEventListener("click", (e) => {
  const btn = e.target.closest(".action-btn");
  if (!btn) return;

  const orderId = btn.dataset.id;
  const status = btn.dataset.status;

  const ok = confirm(`Mark order as ${status}?`);
  if (!ok) return;

  updateStatus(orderId, status);

  console.log("clicked");
});

function refreshDashboardStats() {
  localStorage.setItem("refreshDashboard", "true");
}
