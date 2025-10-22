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

// === RENDER TASKS STACKED IN MAIN ===
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

const bgSelector = document.getElementById("bgSelector");
const bgPreviewContainer = document.getElementById("bgPreviewContainer");
const bgPreview = document.getElementById("bgPreview");
const bgUpload = document.getElementById("bgUpload");

const backgrounds = {
  default: "linear-gradient(135deg, #101820, #2a9d8f, #e9c46a)",
  galaxy: "url('galaxy.jpg') center/cover no-repeat",
  forest: "url('forest.jpg') center/cover no-repeat",
  ocean: "url('ocean.jpg') center/cover no-repeat",
  abstract: "url('abstract.jpg') center/cover no-repeat",
};

// === Fungsi untuk update preview ===
function updatePreview(value) {
  if (value === "custom") {
    // Buka file picker
    bgUpload.click();
  } else if (backgrounds[value].startsWith("url(")) {
    const imgUrl = backgrounds[value].match(/url\('(.*?)'\)/)[1];
    bgPreview.src = imgUrl;
    bgPreviewContainer.classList.add("active");
  } else {
    // untuk background gradient
    bgPreviewContainer.classList.remove("active");
  }
}

// === Apply saved background on load ===
const savedBg = localStorage.getItem("background");
const savedCustom = localStorage.getItem("customBackground");
if (savedBg) {
  if (savedBg === "custom" && savedCustom) {
    document.body.style.background = `url('${savedCustom}') center/cover no-repeat`;
    bgPreview.src = savedCustom;
    bgPreviewContainer.classList.add("active");
    bgSelector.value = "custom";
  } else if (backgrounds[savedBg]) {
    document.body.style.background = backgrounds[savedBg];
    bgSelector.value = savedBg;
    updatePreview(savedBg);
  }
}

// === Change background dynamically ===
bgSelector.addEventListener("change", () => {
  const selected = bgSelector.value;
  if (selected === "custom") {
    updatePreview("custom");
    return;
  }

  document.body.style.background = backgrounds[selected];
  localStorage.setItem("background", selected);
  updatePreview(selected);
});

// === Upload custom background ===
bgUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const imageUrl = event.target.result;
    document.body.style.background = `url('${imageUrl}') center/cover no-repeat`;
    bgPreview.src = imageUrl;
    bgPreviewContainer.classList.add("active");
    localStorage.setItem("background", "custom");
    localStorage.setItem("customBackground", imageUrl);
  };
  reader.readAsDataURL(file);
});


const backgrounds = {
  default: "linear-gradient(135deg, #101820, #2a9d8f, #e9c46a)",
  galaxy: "url('galaxy.jpg') center/cover no-repeat",
  forest: "url('forest.jpg') center/cover no-repeat",
  ocean: "url('ocean.jpg') center/cover no-repeat",
  abstract: "url('abstract.jpg') center/cover no-repeat",
};

// === Apply saved background on load ===
const savedBg = localStorage.getItem("background");
if (savedBg && backgrounds[savedBg]) {
  document.body.style.background = backgrounds[savedBg];
  bgSelector.value = savedBg;
}

// === Change background dynamically ===
bgSelector.addEventListener("change", () => {
  const selected = bgSelector.value;
  document.body.style.background = backgrounds[selected];
  localStorage.setItem("background", selected);
});


// Initial render
renderList();
renderDetails();
