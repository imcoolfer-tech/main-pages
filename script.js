const newTaskBtn = document.querySelector(".new-task");
const taskList = document.querySelector(".task-list");
const taskTitleHeader = document.getElementById("taskTitleHeader");
const taskDetails = document.getElementById("taskDetails");
const modal = document.getElementById("modal");
const saveTaskBtn = document.getElementById("saveTask");
const cancelTaskBtn = document.getElementById("cancelTask");
const taskInput = document.getElementById("taskInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;

// === RENDER TASK LIST ===
function renderList() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    li.className = task.completed ? "completed" : "";
    if (selectedTask === index) li.classList.add("active");

    li.addEventListener("click", () => {
      selectedTask = index;
      renderList();
      renderDetails();
    });

    taskList.appendChild(li);
  });
}

// === RENDER DETAILS ===
function renderDetails() {
  if (selectedTask === null) {
    taskTitleHeader.textContent = "Select a task";
    taskDetails.innerHTML = "<p>Select a task from the list to view details here.</p>";
    return;
  }

  const task = tasks[selectedTask];
  taskTitleHeader.textContent = task.title;
  taskDetails.innerHTML = `
    <div class="task-meta">Created: ${task.date}</div>
    <p>Status: ${task.completed ? "✅ Completed" : "🕓 In Progress"}</p>
    <div class="task-actions">
      <button id="toggleComplete">${task.completed ? "Mark Incomplete" : "Mark Complete"}</button>
      <button id="deleteTask">Delete</button>
    </div>
  `;

  document.getElementById("toggleComplete").addEventListener("click", () => {
    task.completed = !task.completed;
    save();
  });

  document.getElementById("deleteTask").addEventListener("click", () => {
    tasks.splice(selectedTask, 1);
    selectedTask = null;
    save();
  });
}

// === SAVE TO LOCALSTORAGE ===
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderList();
  renderDetails();
}

// === ADD NEW TASK ===
newTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  taskInput.value = "";
  taskInput.focus();
});

cancelTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  if (title === "") return alert("Task title cannot be empty!");

  const newTask = {
    title,
    date: new Date().toLocaleString(),
    completed: false,
  };
  tasks.unshift(newTask);
  selectedTask = 0;
  save();
  modal.style.display = "none";
});

// Initial render
renderList();
renderDetails();
