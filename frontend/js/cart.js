const cartItemsDiv = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const deliveryCharges = document.getElementById("deliveryCharges");
const finalPrice = document.getElementById("finalPrice");
const orderSummaryDiv = document.getElementById("orderSummary");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// console.log(cart)

let itemsTotal = 0;
let GST = 0;
let grandTotal = 0;
cart.forEach((product) => {
  let price = product.price;
  let quantity = product.quantity;

  const html = `
        <div class="item">
            <h4>${product.name}</h4>
            <p>₹${product.price} / kg</p>

            <div class="qty-controls">
                <button onclick="decreaseQty('${product.productId}')">−</button>
                <span class="qty-box">${product.quantity}</span>
                <button onclick="increaseQty('${product.productId}')">+</button>
            </div>

            <button class="remove" onclick="removeProduct('${product.productId}')">remove</button>
        </div>
    
    `;

  itemsTotal += price * quantity;
  GST = (itemsTotal * 20) / 100;
  grandTotal = itemsTotal + GST;

  totalPrice.innerHTML = `₹ ${itemsTotal}`;
  deliveryCharges.innerHTML = `₹ ${GST}`;
  finalPrice.innerHTML = `₹ ${grandTotal}`;

  cartItemsDiv.innerHTML += html;
});

function removeProduct(productId) {
  cart = cart.filter((item) => item.productId !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  location.reload();

  alert(`${product.name} remove successfully`);
}

function increaseQty(productId) {
  const item = cart.find((p) => p.productId === productId);

  if (item) {
    item.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
}

function decreaseQty(productId) {
  const item = cart.find((p) => p.productId === productId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((p) => p.productId !== productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

if (cart.length === 0) {
  cartItemsDiv.innerHTML = "No products added to cart yet...";
  orderSummaryDiv.classList.add("displayDiv");
}

async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buyerId: localStorage.getItem("userId"),
        cart: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      alert(data.message || "Order failed");
      return;
    }

    localStorage.removeItem("cart");
    alert("Order placed successfully");
    window.location.href = "../buyer/buyerOrders.html";
  } catch (error) {
    alert("Server not responding");
  }
}

checkoutBtn.addEventListener("click", placeOrder);
