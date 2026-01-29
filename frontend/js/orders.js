const kisanId = localStorage.getItem("userId");
const table = document.getElementById("ordersTable");

async function loadOrders() {
  const response = await fetch(
    `http://localhost:5000/api/orders/kisan/${kisanId}`,
  );

  const data = await response.json();

  table.innerHTML = "";

  data.orders.forEach((order) => {
    const items = order.items
      .map((i) => `${i.name} (${i.quantity})`)
      .join("<br>");

    let actionBtn = "";

    if (order.status === "Pending") {
      actionBtn = `
        <button class="accept"
          onclick="updateStatus('${order._id}', 'Accepted')">
          Accept
        </button>`;
    } else if (order.status === "Accepted") {
      actionBtn = `
        <button class="deliver"
          onclick="updateStatus('${order._id}', 'Delivered')">
          Delivered
        </button>`;
    }

    const html = `
      <tr>
        <td>${order.buyerId?.name || "Buyer"}</td>
        <td>${items}</td>
        <td>₹ ${order.totalAmount}</td>
        <td>${order.status}</td>
        <td>${actionBtn}</td>
      </tr>
    `;

    table.innerHTML += html;
  });
}

async function updateStatus(orderId, status) {
  await fetch(`http://localhost:5000/api/orders/status/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  loadOrders();
}

loadOrders();
