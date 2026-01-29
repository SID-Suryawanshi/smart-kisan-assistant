const buyerId = localStorage.getItem("userId");
const table = document.getElementById("ordersTable");

if (!buyerId) {
  window.location.href = "./login.html";
}

async function loadOrders() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/buyer/${buyerId}`,
    );

    const data = await response.json();

    table.innerHTML = "";

    if (data.orders.length === 0) {
      table.innerHTML = "<tr><td colspan='5'>No orders found</td></tr>";
      return;
    }

    data.orders.forEach((order) => {
      const items = order.items
        .map((i) => `${i.name} (${i.quantity})`)
        .join("<br>");

      const html = `
        <tr>
          <td>${order.kisanId?.name || "Farmer"}</td>
          <td>${items}</td>
          <td>₹ ${order.totalAmount}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
      `;

      table.innerHTML += html;
    });
  } catch (error) {
    table.innerHTML = "<tr><td colspan='5'>Failed to load orders</td></tr>";
  }
}

loadOrders();
