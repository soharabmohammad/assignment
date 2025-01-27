// Form field variables
const inputContainer = document.getElementById("user-input-main");
const updateContainer = document.getElementById("update-container");
const nameInput = document.getElementById("user-input");
const emailInput = document.getElementById("user-email-input");
const addBtn = document.getElementById("add-btn");
const tableBody = document.getElementById("table-body");
const updateNameInput = document.getElementById("update-user-input");
const updateEmailInput = document.getElementById("update-user-email-input");
const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");
const message = document.getElementById("indicator");
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUserId = null;

const API_URL = "https://jsonplaceholder.typicode.com/users";

async function getUsers() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    localStorage.setItem("users", JSON.stringify(data));
    if (!users.length) location.reload();
    return data;
  } catch (error) {
    console.log(error);
  }
}
getUsers();

// Functions
async function renderTable() {
  const data = users?.length === 0 ? usersData : users;
  tableBody.innerHTML = "";
  data.forEach((user) => {
    const tr = document.createElement("tr");
    const idTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const emailTd = document.createElement("td");
    const actionsTd = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    idTd.innerText = user.id;
    nameTd.innerText = user.name;
    emailTd.innerText = user.email;
    editBtn.innerText = "✎";
    deleteBtn.innerText = "❌";
    editBtn.addEventListener("click", () => {
      showUpdateForm(user.id);
    });
    deleteBtn.addEventListener("click", () => {
      deleteUser(user.id);
    });
    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(idTd);
    tr.appendChild(nameTd);
    tr.appendChild(emailTd);
    tr.appendChild(actionsTd);
    tableBody.appendChild(tr);
  });
}

async function addUser() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const user = {
    name: name,
    email: email,
  };
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (response.status === 201) {
    message.innerText = `You've uccessfully added new user!`;
    setTimeout(() => {
      message.innerText = ``;
    }, 3000);
  }

  if (name && email != null) {
    user.id = Math.floor(Math.random() * 30);
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    nameInput.value = "";
    emailInput.value = "";
    renderTable();
  } else {
    alert("Name is Required");
  }
}

async function updateUser() {
  const index = users.findIndex((user) => user.id === currentUserId);
  const name = updateNameInput.value;
  const email = updateEmailInput.value;
  const user = users[index];

  const response = await fetch(`${API_URL}/${user?.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(users[index]),
  });

  if (response.status === 200) {
    message.innerText = `Id: ${user.id} updated successfully!`;
    setTimeout(() => {
      message.innerText = ``;
    }, 3000);
  }

  if (index !== -1) {
    user.name = name;
    user.email = email;
    localStorage.setItem("users", JSON.stringify(users));
    hideUpdateForm();
    renderTable();
  }
}

async function showUpdateForm(userId) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    // Hide input form
    inputContainer.style.display = "none";

    updateNameInput.value = user.name;
    updateEmailInput.value = user.email;
    currentUserId = user.id;
    updateBtn.addEventListener("click", updateUser);
    cancelBtn.addEventListener("click", hideUpdateForm);
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    updateNameInput.style.display = "inline-block";
    updateEmailInput.style.display = "inline-block";
    updateContainer.style.display = "flex";
  }
}

function hideUpdateForm() {
  // Show input form
  inputContainer.style.display = "flex";

  updateNameInput.value = "";
  updateEmailInput.value = "";
  currentUserId = null;
  updateBtn.removeEventListener("click", updateUser);
  cancelBtn.removeEventListener("click", hideUpdateForm);
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
  updateNameInput.style.display = "none";
  updateEmailInput.style.display = "none";
  updateContainer.style.display = "none";
}

async function deleteUser(userId) {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.status === 200) {
    message.innerText = `Id: ${userId} deleted successfully!`;
    setTimeout(() => {
      message.innerText = ``;
    }, 3000);
  }
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("users", JSON.stringify(users));
  if (users.length == 0) {
    hideUpdateForm();
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    //  Hide update form
    updateContainer.style.display = "none";

    // Show input form
    inputContainer.style.display = "flex";
  }

  renderTable();
}

// Event Listeners
addBtn.addEventListener("click", addUser);

// Initialize table
renderTable();
