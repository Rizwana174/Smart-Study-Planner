const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");

const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

const searchTask = document.getElementById("searchTask");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

/* Theme */

if (darkMode) {
    document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    darkMode = document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        JSON.stringify(darkMode)
    );
});

/* Storage */

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* Progress */

function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                  (completed / total) * 100
              );

    progressBar.style.width =
        percentage + "%";

    progressText.textContent =
        percentage + "% Completed";
}

/* Statistics */

function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent =
        total - completed;
}

/* Render */

function renderTasks(list = tasks) {
    taskContainer.innerHTML = "";

    list.forEach((task, index) => {

        if (!task.priority) {
            task.priority = "Medium";
        }

        const li =
            document.createElement("li");

        li.className =
            `task-item ${
                task.completed
                    ? "completed"
                    : ""
            }`;

        const dueDate =
            new Date(task.dueDate);

        const today =
            new Date();

        const difference =
            dueDate - today;

        if (
            difference <
                2 * 24 * 60 * 60 * 1000 &&
            difference > 0 &&
            !task.completed
        ) {
            li.classList.add("urgent");
        }

        li.innerHTML = `
            <div>
                <strong>${task.subject}</strong>
                <br>
                ${task.topic}
                <br>
                📅 ${task.dueDate}
                <br>
                <span class="${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>
            </div>

            <div class="task-buttons">
                <button onclick="toggleTask(${index})">✔</button>
                <button onclick="editTask(${index})">✏</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        taskContainer.appendChild(li);
    });

    updateProgress();
    updateStats();
}

/* Add Task */

function addTask() {

    if (
        !subjectInput.value.trim() ||
        !topicInput.value.trim() ||
        !dueDateInput.value
    ) {
        alert("Please fill all fields");
        return;
    }

    const task = {
        subject: subjectInput.value,
        topic: topicInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    subjectInput.value = "";
    topicInput.value = "";
    dueDateInput.value = "";
}

/* Complete */

function toggleTask(index) {
    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();
    renderTasks();
}

/* Delete */

function deleteTask(index) {

    if (confirm("Delete this task?")) {

        tasks.splice(index, 1);

        saveTasks();
        renderTasks();
    }
}

/* Edit */

function editTask(index) {

    const subject = prompt(
        "Edit Subject",
        tasks[index].subject
    );

    const topic = prompt(
        "Edit Topic",
        tasks[index].topic
    );

    if (subject && topic) {

        tasks[index].subject = subject;
        tasks[index].topic = topic;

        saveTasks();
        renderTasks();
    }
}

/* Search */

searchTask.addEventListener(
    "keyup",
    function () {

        const value =
            this.value.toLowerCase();

        const filtered =
            tasks.filter(task =>
                task.subject
                    .toLowerCase()
                    .includes(value) ||
                task.topic
                    .toLowerCase()
                    .includes(value)
            );

        renderTasks(filtered);
    }
);

/* PDF Export */

document
    .getElementById("exportPdfBtn")
    .addEventListener("click", () => {

        const { jsPDF } =
            window.jspdf;

        const doc =
            new jsPDF();

        doc.text(
            "Smart Study Planner",
            10,
            10
        );

        let y = 20;

        tasks.forEach(task => {

            doc.text(
                `${task.subject} | ${task.topic} | ${task.priority}`,
                10,
                y
            );

            y += 10;
        });

        doc.save(
            "StudyPlanner.pdf"
        );
    });

addTaskBtn.addEventListener(
    "click",
    addTask
);

window.onload = () => {
    renderTasks();
};