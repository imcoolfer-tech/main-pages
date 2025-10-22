// === ELEMENTS ===
const newTaskBtn = document.querySelector(".new-task");
const taskList = document.querySelector(".task-list");
const taskDetails = document.getElementById("taskDetails");
const modal = document.getElementById("modal");
const saveTaskBtn = document.getElementById("saveTask");
const cancelTaskBtn = document.getElementById("cancelTask");
const taskInput = document.getElementById("taskInput");
const taskDescInput = document.getElementById("taskDescInput");
const taskDeadline = document.getElementById("taskDeadline");
const taskProgress = document.getElementById("taskProgress");
const progressValue = document.getElementById("progressValue");
const searchInput = document.getElementById("searchInput");
const quoteBox = document.getElementById("quoteBox");

// === GLOBAL PROGRESS BAR ===
const globalProgressBar = document.createElement("div");
globalProgressBar.className = "global-progress";
globalProgressBar.innerHTML = `
  <div class="progress-bar">
    <div class="progress-fill" id="globalProgressFill" style="width:0%"></div>
  </div>
  <p id="globalProgressText">Total Progress: 0%</p>
`;
document.body.prepend(globalProgressBar);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;

// === TOAST NOTIFICATION ===
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// === UPDATE GLOBAL PROGRESS ===
function updateGlobalProgress() {
  if (tasks.length === 0) {
    document.getElementById("globalProgressFill").style.width = "0%";
    document.getElementById("globalProgressText").textContent = "Total Progress: 0%";
    return;
  }

  const completed = tasks.filter(t => t.completed).length;
  const totalProgress = Math.round((completed / tasks.length) * 100);
  document.getElementById("globalProgressFill").style.width = `${totalProgress}%`;
  document.getElementById("globalProgressText").textContent = `Total Progress: ${totalProgress}%`;
}

// === CHECK DEADLINES ===
function checkDeadlines() {
  const now = new Date();
  tasks.forEach(task => {
    if (task.deadline && !task.completed) {
      const timeLeft = new Date(task.deadline) - now;
      const hoursLeft = timeLeft / (1000 * 60 * 60);

      if (hoursLeft < 24 && hoursLeft > 0) {
        showToast(`⚠️ Deadline for "${task.title}" is less than 24 hours away!`, "warning");
      } else if (hoursLeft <= 0) {
        showToast(`⏰ Deadline missed for "${task.title}"!`, "danger");
      }
    }
  });
}

// === RENDER LIST (Sidebar) ===
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

// === RENDER DETAILS ===
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
      <p>Deadline: ${task.deadline || "<i>No deadline</i>"}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${task.completed ? 100 : task.progress || 0}%"></div>
      </div>
      <p>Progress: ${task.completed ? 100 : task.progress || 0}%</p>
      <p>Status: ${task.completed ? "✅ Completed" : "🕓 In Progress"}</p>
      <button class="toggle">${task.completed ? "Mark Incomplete" : "Mark Complete"}</button>
      <button class="delete">Delete</button>
    `;

    // === EVENT: Toggle complete ===
    div.querySelector(".toggle").addEventListener("click", () => {
      task.completed = !task.completed;
      if (task.completed) showToast(`🎉 Task "${task.title}" completed!`, "success");
      save();
    });

    // === EVENT: Delete ===
    div.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      showToast(`🗑️ Task "${task.title}" deleted.`, "info");
      save();
    });

    taskDetails.appendChild(div);
  });
}

// === SAVE KE LOCAL STORAGE ===
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderList();
  renderDetails();
  updateGlobalProgress();
}

// === MODAL HANDLING ===
newTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  taskInput.value = "";
  taskDescInput.value = "";
  taskDeadline.value = "";
  taskProgress.value = 0;
  progressValue.textContent = "0%";
  taskInput.focus();
});

cancelTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// === PROGRESS SLIDER UPDATE ===
taskProgress.addEventListener("input", () => {
  progressValue.textContent = `${taskProgress.value}%`;
});

// === SAVE TASK BARU ===
saveTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const description = taskDescInput.value.trim();
  const deadline = taskDeadline.value;
  const progress = parseInt(taskProgress.value);

  if (title === "") return alert("Task title cannot be empty!");

  const newTask = {
    title,
    description,
    deadline,
    progress,
    date: new Date().toLocaleString(),
    completed: false,
  };

  tasks.unshift(newTask);
  save();
  modal.style.display = "none";
});

// === SEARCH TASK ===
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
  overlay.style = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:${isCustom ? `url(${src}) center/cover no-repeat` : bgStyle};
    z-index:9999;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#fff;
    backdrop-filter:blur(2px);
  `;
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

// === QUOTES ===
const quotes = [
  "Small steps every day lead to big results.",
  "Focus on progress, not perfection.",
  "Discipline beats motivation.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Done is better than perfect."
];

function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = `"${random}"`;
}
showRandomQuote();

// === INITIALIZE ===
renderList();
renderDetails();
updateGlobalProgress();
checkDeadlines();
setInterval(checkDeadlines, 60000); // cek setiap menit
