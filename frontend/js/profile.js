const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");
const userName = document.getElementById("name");
const userRole = document.getElementById("role");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const avatar = document.getElementById("avatar");
const editBtn = document.getElementById("editBtn");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardLink = document.getElementById("dashboardLink");

if (!role || !userId) {
  window.location.href = "login.html";
}

if (role === "kisan") {
  dashboardLink.href = "./kisan/kisanDashboard.html";
} else {
  dashboardLink.href = "./buyer/buyerDashboard.html";
}

async function loadProfile() {
  try {
    const url =
      role === "kisan"
        ? `http://localhost:5000/api/kisan/profile/${userId}`
        : `http://localhost:5000/api/buyer/profile/${userId}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    userName.innerText = data.name;
    userRole.innerText = role.toUpperCase();
    email.innerText = data.email;
    phone.innerText = data.phone;
    address.innerText = data.address;
    localStorage.setItem("city", data.address);

    avatar.innerText = data.name.charAt(0).toUpperCase();
  } catch (err) {
    alert("Failed to load profile");
  }
}

loadProfile();

let isEditing = false;

editBtn.addEventListener("click", () => {
  if (!isEditing) {
    enableEdit();
  } else {
    saveProfile();
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

async function updateProfile(userData) {
  try {
    const url =
      role === "kisan"
        ? `http://localhost:5000/api/kisan/profile/${userId}`
        : `http://localhost:5000/api/buyer/profile/${userId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("Profile updated", data);
    alert("Profile updated");
  } catch (error) {
    alert("Profile update failed");
  }
}

function enableEdit() {
  convertToInput("name");
  convertToInput("phone");
  convertToInput("address");

  editBtn.textContent = "Save Profile";
  isEditing = true;
}

function saveProfile() {
  const nameValue = document.getElementById("name").value;
  const phoneValue = document.getElementById("phone").value;
  const addressValue = document.getElementById("address").value;

  convertToSpan("name", nameValue);
  convertToSpan("phone", phoneValue);
  convertToSpan("address", addressValue);

  updateProfile({
    name: nameValue,
    phone: phoneValue,
    address: addressValue,
  });

  editBtn.textContent = "Edit Profile";
  isEditing = false;
}

function convertToInput(id) {
  const span = document.getElementById(id);
  const value = span.textContent;

  const input = document.createElement("input");
  input.value = value;
  input.id = id;
  input.className = "edit-input";

  span.replaceWith(input);
}

function convertToSpan(id) {
  const input = document.getElementById(id);
  const value = input.value;

  const span = document.createElement("span");
  span.id = id;
  span.textContent = value;
  input.replaceWith(span);
}
