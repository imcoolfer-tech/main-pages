// ==============================
// 🧠 CHECK LOGIN STATUS
// ==============================
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "https://imcoolfer-tech.github.io/login-page/";
}

// ==============================
// 📦 ELEMENT SELECTORS
// ==============================
const newTaskBtn = document.querySelector(".new-task");
const taskList = document.querySelector(".task-list");
const taskDetails = document.getElementById("taskDetails");
const modal = document.getElementById("modal");
const saveTaskBtn = document.getElementById("saveTask");
const cancelTaskBtn = document.getElementById("cancelTask");
const taskInput = document.getElementById("taskInput");
const taskDescInput = document.getElementById("taskDescInput");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");

// ==============================
// 💾 INITIAL DATA
// ==============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;

// ==============================
// 🔁 RENDER TASKS IN SIDEBAR
// ==============================
function renderList(filtered = tasks) {
  taskList.innerHTML = "";

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty">No tasks found</li>`;
    return;
  }

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    li.className = task.completed ? "completed" : "";
    if (selectedTask === index) li.classList.add("active");

    li.addEventListener("click", () => {
      selectedTask = index;
      renderList(filtered);
      document.getElementById(`task-${index}`).scrollIntoView({ behavior: "smooth" });
    });

    taskList.appendChild(li);
  });
}

// ==============================
// 🧩 RENDER STACKED TASK DETAILS
// ==============================
function renderDetails(filtered = tasks) {
  taskDetails.innerHTML = "";

  if (filtered.length === 0) {
    taskDetails.innerHTML = `<p class="no-task">No tasks to display.</p>`;
    return;
  }

  filtered.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.id = `task-${index}`;

    div.innerHTML = `
      <h4>${task.title}</h4>
      <div class="meta">🕒 Created: ${task.date}</div>
      <p class="desc">${task.description || "<i>No description provided</i>"}</p>
      <p>Status: ${task.completed ? "✅ Completed" : "⏳ In Progress"}</p>
      <div class="task-actions">
        <button class="toggle">${task.completed ? "Mark Incomplete" : "Mark Complete"}</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Toggle status
    div.querySelector(".toggle").addEventListener("click", () => {
      task.completed = !task.completed;
      save();
    });

    // Delete task
    div.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
    });

    taskDetails.appendChild(div);
  });
}

// ==============================
// 💾 SAVE TO LOCAL STORAGE
// ==============================
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderList();
  renderDetails();
}

// ==============================
// ➕ ADD NEW TASK
// ==============================
newTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  taskInput.value = "";
  taskDescInput.value = "";
  taskInput.focus();
});

cancelTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const description = taskDescInput.value.trim();

  if (title === "") {
    alert("Task title cannot be empty!");
    return;
  }

  const newTask = {
    title,
    description,
    date: new Date().toLocaleString(),
    completed: false,
  };

  tasks.unshift(newTask);
  save();
  modal.style.display = "none";
});

// ==============================
// 🔍 SEARCH FUNCTIONALITY
// ==============================
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.title.toLowerCase().includes(query));
  renderList(filtered);
  renderDetails(filtered);
});

// ==============================
// 🚪 LOGOUT BUTTON
// ==============================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "https://imcoolfer-tech.github.io/login-page/";
  });
}

// ==============================
// 🚀 INITIAL RENDER
// ==============================
renderList();
renderDetails();
