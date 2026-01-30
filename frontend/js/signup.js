const form = document.getElementById("userForm");
const role = document.getElementById("role");
const userName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const address = document.getElementById("address");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendData();
});

async function sendData() {
  if (password.value != confirmPassword.value) {
    alert("Password do not match");
    return;
  }

  const user = {
    role: role.value,
    name: userName.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    address: address.value,
  };

  try {
    const url =
      role.value === "kisan"
        ? "http://localhost:5000/api/kisan/signup"
        : "http://localhost:5000/api/buyer/signup";

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
      alert(data.message || "Signup failed");
      return;
    }

    alert(data.message);
  } catch (error) {
    alert("Something went wrong");
  }

  if (role.value === "kisan") {
    window.location.href = "kisan/kisanDashboard.html";
  } else if (role.value === "buyer") {
    window.location.href = "buyer/buyerDashboard.html";
  } else {
    alert("Fill all details");
  }
}
