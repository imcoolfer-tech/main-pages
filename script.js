const newTaskBtn = document.querySelector(".new-task");
const taskList = document.querySelector(".task-list");
const taskDetails = document.getElementById("taskDetails");
const modal = document.getElementById("modal");
const saveTaskBtn = document.getElementById("saveTask");
const cancelTaskBtn = document.getElementById("cancelTask");
const taskInput = document.getElementById("taskInput");
const taskDescInput = document.getElementById("taskDescInput");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;

// === RENDER TASKS IN SIDEBAR ===
function renderList(filtered = tasks) {
  taskList.innerHTML = "";
  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    if (selectedTask === index) li.classList.add("active");

    li.addEventListener("click", () => {
      selectedTask = index;
      renderList(filtered);
      document.getElementById(`task-${index}`).scrollIntoView({ behavior: "smooth" });
    });

    taskList.appendChild(li);
  });
}

// === RENDER TASK DETAILS ===
function renderDetails(filtered = tasks) {
  taskDetails.innerHTML = "";
  filtered.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.id = `task-${index}`;
    div.innerHTML = `
      <h4>${task.title}</h4>
      <div class="meta">Created: ${task.date}</div>
      <p class="desc">${task.description || "<i>No description</i>"}</p>
      <p>Status: ${task.completed ? "✅ Completed" : "🕓 In Progress"}</p>
      <button class="toggle">${task.completed ? "Mark Incomplete" : "Mark Complete"}</button>
      <button class="delete">Delete</button>
    `;

    div.querySelector(".toggle").addEventListener("click", () => {
      task.completed = !task.completed;
      save();
    });

    div.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
    });

    taskDetails.appendChild(div);
  });
}

// === SAVE TO LOCAL STORAGE ===
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderList();
  renderDetails();
}

// === ADD NEW TASK ===
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

  if (title === "") return alert("Task title cannot be empty!");

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

// === SEARCH FUNCTION ===
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter((task) => task.title.toLowerCase().includes(query));
  renderList(filtered);
  renderDetails(filtered);
});

// === BACKGROUND HANDLING ===
const bgSelector = document.getElementById("bgSelector");
const bgPreview = document.getElementById("bgPreview");
const bgPreviewContainer = document.getElementById("bgPreviewContainer");
const bgUpload = document.getElementById("bgUpload");

const backgrounds = {
  default: "linear-gradient(135deg, #101820, #2a9d8f, #e9c46a)",
  galaxy: "url('galaxy.jpg') center/cover no-repeat",
  forest: "url('forest.jpg') center/cover no-repeat",
  ocean: "url('ocean.jpg') center/cover no-repeat",
  abstract: "url('abstract.jpg') center/cover no-repeat",
};

// === APPLY SAVED BACKGROUND ON LOAD ===
const savedBg = localStorage.getItem("background");
const savedCustomBg = localStorage.getItem("customBg");

if (savedCustomBg) {
  document.body.style.background = `url(${savedCustomBg}) center/cover no-repeat`;
  bgSelector.value = "custom";
  updatePreview(savedCustomBg);
} else if (savedBg && backgrounds[savedBg]) {
  document.body.style.background = backgrounds[savedBg];
  bgSelector.value = savedBg;
  updatePreviewFromKey(savedBg);
} else {
  document.body.style.background = backgrounds.default;
  updatePreviewFromKey("default");
}

// === PREVIEW FUNCTION ===
function updatePreviewFromKey(key) {
  const urlMatch = backgrounds[key].match(/url\('(.*)'\)/);
  if (urlMatch) {
    bgPreview.src = urlMatch[1];
    bgPreviewContainer.classList.add("active");
  } else {
    bgPreview.src = "";
    bgPreviewContainer.classList.remove("active");
  }
}

function updatePreview(src) {
  bgPreview.src = src;
  bgPreviewContainer.classList.add("active");
}

// === HANDLE SELECTION CHANGE ===
bgSelector.addEventListener("change", () => {
  const selected = bgSelector.value;

  if (selected === "custom") {
    bgUpload.click();
    return;
  }

  localStorage.removeItem("customBg");
  document.body.style.background = backgrounds[selected];
  localStorage.setItem("background", selected);
  updatePreviewFromKey(selected);
});

// === HANDLE CUSTOM UPLOAD ===
bgUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageSrc = event.target.result;
    document.body.style.background = `url(${imageSrc}) center/cover no-repeat`;
    localStorage.setItem("customBg", imageSrc);
    localStorage.setItem("background", "custom");
    updatePreview(imageSrc);
  };
  reader.readAsDataURL(file);
});

// === INITIAL RENDER ===
renderList();
renderDetails();
