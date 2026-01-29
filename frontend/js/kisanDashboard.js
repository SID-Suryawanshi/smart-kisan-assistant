const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

if (!userId || !role) {
  window.location.href = "./login.html";
}

const totalProducts = document.getElementById("totalProducts");
const ordersRecieved = document.getElementById("ordersReceived");
const ordersPending = document.getElementById("ordersPending");
const earnings = document.getElementById("ernings");
