const form = document.getElementById("userForm");
const role = document.getElementById("role");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getData();
});

async function getData() {
  const user = {
    email: email.value,
    password: password.value,
  };

  try {
    const url =
      role.value === "kisan"
        ? "http://localhost:5000/api/kisan/login"
        : "http://localhost:5000/api/buyer/login";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("userId", data.kisanId || data.buyerId);

    if (data.Role === "kisan") {
      // localStorage.setItem("kisanId", data.kisanId);
      localStorage.setItem("role", data.Role);
      window.location.href = "kisan/kisanDashboard.html";
    } else {
      // localStorage.setItem("buyeId", data.buyerId);
      localStorage.setItem("role", data.Role);
      window.location.href = "buyer/buyerDashboard.html";
    }

    // alert(data.message);
  } catch (error) {
    alert("Server error");
  }
}
