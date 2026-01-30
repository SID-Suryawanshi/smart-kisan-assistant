// const productForm = document.getElementById("productForm");
// const productName = document.getElementById("productName");
// const category = document.getElementById("category");
// const price = document.getElementById("price");
// const quantity = document.getElementById("quantity");
// const description = document.getElementById("description");

// productForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   alert(`${productName.value} added successfully`);
// });

// async function getData() {
//   const productData = {
//     productImage: productImage,
//     name: productName.value,
//     category: category.value,
//     price: price.value,
//     quantity: quantity.value,
//     description: description.value,
//     kisanId: localStorage.getItem("userId"),
//   };

//   try {
//     const response = await fetch("http://localhost:5000/api/products/add", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(productData),
//     });

//     const data = await response.json();
//     console.log(data);

//     if (!response.ok) {
//       alert(data.message);
//       return;
//     }
//   } catch (err) {
//     alert("server error");
//   }
// }

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productImage = document.getElementById("productImage").files[0];

  if (!productImage) {
    alert("Please select product image");
    return;
  }

  const formData = new FormData();

  formData.append("image", productImage);
  formData.append("name", document.getElementById("productName").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("quantity", document.getElementById("quantity").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("kisanId", localStorage.getItem("userId"));

  try {
    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      body: formData, // ✅ no headers
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Product added successfully");
    productForm.reset();
  } catch (err) {
    alert("Server error");
  }
});
