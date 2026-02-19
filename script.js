let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const progressPercentEl = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (input.value === "") return;

  tasks.push({ text: input.value, completed: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    taskList.innerHTML += `
      <div class="task ${task.completed ? "completed" : ""}">
        <span onclick="toggleTask(${index})">${task.text}</span>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
  });

  updateAnalytics();
}

function updateAnalytics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  progressPercentEl.textContent = percent + "%";
  progressBar.style.width = percent + "%";

  updateChart(completed, total - completed);
}

const ctx = document.getElementById("taskChart").getContext("2d");

let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Pending"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#4caf50", "#f44336"]
    }]
  }
});

function updateChart(completed, pending) {
  chart.data.datasets[0].data = [completed, pending];
  chart.update();
}

renderTasks();
