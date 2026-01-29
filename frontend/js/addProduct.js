const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const category = document.getElementById("category");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getData();
  alert(`${productName.value} added successfully`);
});
console.log("kisanId : ", localStorage.getItem("userId"));

async function getData() {
  const productData = {
    name: productName.value,
    category: category.value,
    price: price.value,
    quantity: quantity.value,
    description: description.value,
    kisanId: localStorage.getItem("userId"),
  };

  try {
    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    console.log(data);


    if (!response.ok) {
      alert(data.message);
      return;
    }
  } catch (err) {
    alert("server error");
  }
}
