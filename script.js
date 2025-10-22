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

// === RENDER LIST DAN DETAIL ===
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

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderList();
  renderDetails();
}

// === TASK MODAL ===
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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter((task) => task.title.toLowerCase().includes(query));
  renderList(filtered);
  renderDetails(filtered);
});

// === BACKGROUND HANDLING ===
const bgSelector = document.getElementById("bgSelector");
const bgUpload = document.getElementById("bgUpload");

const backgrounds = {
  default: "linear-gradient(135deg, #101820, #2a9d8f, #e9c46a)",
  galaxy: "url('galaxy.jpg') center/cover no-repeat",
  forest: "url('forest.jpg') center/cover no-repeat",
  ocean: "url('ocean.jpg') center/cover no-repeat",
  abstract: "url('abstract.jpg') center/cover no-repeat",
};

// === LOAD SAVED BACKGROUND ===
const savedBg = localStorage.getItem("background");
const savedCustomBg = localStorage.getItem("customBg");

if (savedCustomBg) {
  document.body.style.background = `url(${savedCustomBg}) center/cover no-repeat`;
  bgSelector.value = "custom";
} else if (savedBg && backgrounds[savedBg]) {
  document.body.style.background = backgrounds[savedBg];
  bgSelector.value = savedBg;
} else {
  document.body.style.background = backgrounds.default;
}

// === PREVIEW OVERLAY ===
function createPreviewOverlay(bgStyle, src = null, isCustom = false) {
  const overlay = document.createElement("div");
  overlay.className = "bg-preview-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = isCustom ? `url(${src}) center/cover no-repeat` : bgStyle;
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "#fff";
  overlay.style.backdropFilter = "blur(2px)";
  overlay.innerHTML = `
    <div style="background:rgba(0,0,0,0.5);padding:20px 40px;border-radius:20px;text-align:center;">
      <h2>Preview Background</h2>
      <p>Do you want to apply this background?</p>
      <button id="confirmBg" style="margin:10px;padding:10px 20px;border:none;border-radius:8px;background:#2a9d8f;color:white;">Confirm</button>
      <button id="cancelBg" style="margin:10px;padding:10px 20px;border:none;border-radius:8px;background:#e76f51;color:white;">Cancel</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#confirmBg").addEventListener("click", () => {
    if (isCustom) {
      localStorage.setItem("customBg", src);
      localStorage.setItem("background", "custom");
      document.body.style.background = `url(${src}) center/cover no-repeat`;
    } else {
      localStorage.setItem("background", bgSelector.value);
      localStorage.removeItem("customBg");
      document.body.style.background = bgStyle;
    }
    overlay.remove();
  });

  overlay.querySelector("#cancelBg").addEventListener("click", () => overlay.remove());
}

// === HANDLE DROPDOWN CHANGE ===
bgSelector.addEventListener("change", () => {
  const selected = bgSelector.value;

  if (selected === "custom") {
    bgUpload.click();
    return;
  }

  createPreviewOverlay(backgrounds[selected]);
});

// === HANDLE CUSTOM UPLOAD ===
bgUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageSrc = event.target.result;
    createPreviewOverlay(null, imageSrc, true);
  };
  reader.readAsDataURL(file);
});

// === INITIAL RENDER ===
renderList();
renderDetails();
