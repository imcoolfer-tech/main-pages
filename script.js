// === SELECT ELEMENTS ===
const newTaskBtn = document.querySelector(".new-task");
const taskGrid = document.querySelector(".task-grid");

// buat modal tambah task sederhana
const modal = document.createElement("div");
modal.classList.add("modal");
modal.innerHTML = `
  <div class="modal-content">
    <h3>New Task</h3>
    <input type="text" id="taskTitle" placeholder="Task title..." />
    <div class="modal-buttons">
      <button id="saveTask">Save</button>
      <button id="cancelTask">Cancel</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

// sembunyikan modal
modal.style.display = "none";

// === DATA TASKS ===
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// === FUNCTIONS ===

// render tampilan task
function renderTasks() {
  taskGrid.innerHTML = "";
  if (tasks.length === 0) {
    taskGrid.innerHTML = "<p style='color:#999'>No tasks yet.</p>";
    return;
  }

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.completed) card.classList.add("completed");

    card.innerHTML = `
      <div class="date">${task.date}</div>
      <p>${task.title}</p>
      <div class="tags">
        <span class="team">Team</span>
        <span class="important">Important</span>
      </div>
      <div class="actions">
        <button class="done">✔</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    // event tombol selesai
    card.querySelector(".done").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // event tombol hapus
    card.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskGrid.appendChild(card);
  });
}

// simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// buka modal tambah task
newTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  document.getElementById("taskTitle").focus();
});

// tombol cancel
document.getElementById("cancelTask").addEventListener("click", () => {
  modal.style.display = "none";
  document.getElementById("taskTitle").value = "";
});

// tombol simpan task
document.getElementById("saveTask").addEventListener("click", () => {
  const title = document.getElementById("taskTitle").value.trim();
  if (title === "") return alert("Task title cannot be empty!");

  const newTask = {
    title,
    date: new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  document.getElementById("taskTitle").value = "";
  modal.style.display = "none";
});

// === INITIALIZE ===
renderTasks();
