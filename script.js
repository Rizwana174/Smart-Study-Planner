const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

// 🌙 Toggle Theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", darkMode);
  themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

if (darkMode) {
  document.body.classList.add("dark-mode");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// 💾 Save Tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 📈 Update Progress
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}% Completed`;
}

// 🧱 Render Tasks
function renderTasks() {
  taskContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.subject} - ${task.topic} (Due: ${task.dueDate})</span>
      <div class="task-buttons">
        <button onclick="toggleTask(${index})"><i class="fas fa-check"></i></button>
        <button onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    taskContainer.appendChild(li);
  });
  updateProgress();
}

// ➕ Add Task
function addTask() {
  if (!subjectInput.value || !topicInput.value || !dueDateInput.value) {
    alert("Please fill all fields!");
    return;
  }

  const newTask = {
    subject: subjectInput.value,
    topic: topicInput.value,
    dueDate: dueDateInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  subjectInput.value = "";
  topicInput.value = "";
  dueDateInput.value = "";
}

// ✔️ Toggle Task Complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// ✏️ Edit Task
function editTask(index) {
  const newSubject = prompt("Edit Subject:", tasks[index].subject);
  const newTopic = prompt("Edit Topic:", tasks[index].topic);
  const newDate = prompt("Edit Due Date (YYYY-MM-DD):", tasks[index].dueDate);

  if (newSubject && newTopic && newDate) {
    tasks[index].subject = newSubject;
    tasks[index].topic = newTopic;
    tasks[index].dueDate = newDate;
    saveTasks();
    renderTasks();
  }
}

// 🗑️ Delete Task
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

addTaskBtn.addEventListener("click", addTask);
window.onload = renderTasks;
