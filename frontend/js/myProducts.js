const userId = localStorage.getItem("userId");
const productsDiv = document.getElementById("productsList");
const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");


if (!userId) {
  window.location.href = "./login.html";
}

async function getMyProducts() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/my-products/${userId}`,
    );

    const data = await response.json();
    // console.log(data);

    if (data.products.length === 0) {
      productsDiv.innerHTML = "<p>No products added yet.</p>";
      return;
    }

    let html = `<div class="product-grid">`;

    data.products.forEach((product) => {
      html += `
    <div class="product-card">
     
    <img
  src="${
    product.image
      ? `http://localhost:5000/uploads/${product.image}`
      : '../assets/images/no-image.png'
  }"
  class="product-img"
  alt="${product.name}"
/>


      <div class="product-header">
        <h4>${product.name}</h4>
        <span class="category">${product.category}</span>
      </div>

      <div class="product-body">
        <p><b>Price:</b> <span>₹${product.price}/kg</span> </p>
        <p><b>Quantity:</b> <span> ${product.quantity} kg </span> </p>
        <p><b>Description:</b> ${product.description}</p>
      </div>

      <div class="product-actions">

        <button 
          class="btn edit"
          data-id="${product._id}"
          data-name="${product.name}"
          data-category="${product.category}"
          data-price="${product.price}"
          data-quantity="${product.quantity}"
          data-description="${product.description}"
          onclick="openEditModal(this)">Edit
        </button>


        <button class="btn delete" onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    </div>
  `;
    });

    html += `</div>`;

    productsDiv.innerHTML = html;

    productsDiv.innerHTML = html;
  } catch (error) {
    productsDiv.innerHTML = "<p>Failed to load products</p>";
  }
}

getMyProducts();

function openEditModal(button) {
  const id = button.dataset.id;
  const name = button.dataset.name;
  const category = button.dataset.category;
  const price = button.dataset.price;
  const quantity = button.dataset.quantity;
  const description = button.dataset.description;

  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = name;
  document.getElementById("edit-category").value = category;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-quantity").value = quantity;
  document.getElementById("edit-description").value = description;

  editDialog.showModal();
}

async function deleteProduct(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/remove/${id}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();
    console.log(data);

    alert("Product is deleted successfully");
  } catch (error) {
    alert("Failed to delete product");
  }
  getMyProducts();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updateData = {
    name: document.getElementById("edit-name").value,
    category: document.getElementById("edit-category").value,
    price: document.getElementById("edit-price").value,
    quantity: document.getElementById("edit-quantity").value,
  };

  const id = document.getElementById("edit-id").value;

  await fetch(`http://localhost:5000/api/products/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  editDialog.close();

  getMyProducts();
});
