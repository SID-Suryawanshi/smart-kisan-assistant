const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
const availableProductsDiv = document.getElementById("availableProducts");
const loader = document.getElementById("loader");

let allProducts = [];

if (!userId || !role) {
  window.location.href = "./login.html";
}

async function showProducts() {
  try {
    const response = await fetch("http://localhost:5000/api/buyer/products");

    const data = await response.json();
    // console.log(data);
    window.products = data.products;
    allProducts = data.products;

    renderProducts(allProducts);
  } catch (error) {
    availableProductsDiv.innerHTML = "<p>No products are available</p>";
  } finally {
    loader.style.display = "none";
    availableProductsDiv.style.display = "grid";
  }
}

showProducts();

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = window.products.find((p) => p._id === productId);

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
}

function renderProducts(products) {
  availableProductsDiv.innerHTML = "";

  if (products.length === 0) {
    availableProductsDiv.innerHTML = "<p>No products found</p>";
  }

  products.forEach((grocery) => {
    const html = `
      <div class="product">

          <img
  src="${
    grocery.image
      ? `http://localhost:5000/uploads/${grocery.image}`
      : "../images/no-image.png"
  }"
  class="product-img"
  alt="${grocery.name}"
/>


            <h4>${grocery.name}</h4>
            <p>Rating : ${grocery.averageRating.toFixed(1)} / 5</p>
            <h5>Farmer : ${grocery.kisanId.name || "Certified farmer"}</h5>
            <p>₹${grocery.price} / kg</p>
            <p>Category : ${grocery.category}</p>
            <p>Available : ${grocery.quantity} kg</p>
            <button onclick = "addToCart('${grocery._id}')">Add to Cart</button>
            <button style="margin-top:5px; background:#444;" onclick="openReviewModal('${grocery._id}')">Leave Review</button>
        </div>
        `;

    availableProductsDiv.innerHTML += html;
  });
}

function filterCategory(category) {
  if (category === "All") {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(
    (product) => product.category === category,
  );

  renderProducts(filtered);
}

document.querySelectorAll(".category").forEach((cat) => {
  cat.addEventListener("click", () => {
    document
      .querySelectorAll(".category")
      .forEach((c) => c.classList.remove("active"));

    cat.classList.add("active");

    filterCategory(cat.dataset.category);
  });
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(value),
  );

  renderProducts(filtered);
});

document.getElementById("sortPrice").addEventListener("change", (e) => {
  let sorted = [...allProducts];

  if (e.target.value === "low") {
    sorted.sort((a, b) => a.price - b.price);
  }

  if (e.target.value === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
});

// Function to handle the review process
async function openReviewModal(productId) {
  const rating = prompt("Please enter a rating between 1 and 5:");

  if (!rating || rating < 1 || rating > 5) {
    alert("Please enter a valid rating between 1 and 5.");
    return;
  }

  const comment = prompt("Enter your comments about the product:");
  const buyerId = localStorage.getItem("userId");

  if (!buyerId) {
    alert("You must be logged in to leave a review.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/products/review/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerId: buyerId,
          rating: Number(rating),
          comment: comment,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("Review submitted successfully!");
      location.reload(); 
    } else {
      alert(data.message || "Failed to submit review");
    }
  } catch (error) {
    console.error("Review Error:", error);
    alert("Server error. Please try again later.");
  }
}
