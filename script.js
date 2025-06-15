// ===============================
// 🌙 DARK MODE TOGGLE
// ===============================
const toggle = document.getElementById("themeToggle");

if (toggle) {
  // Apply saved theme on load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
  }

  // Toggle dark mode
  toggle.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };
}

// ===============================
// 🎠 CAROUSEL CONTROL
// ===============================
const images = ["images/slide1.jpg", "images/slide2.jpg", "images/slide3.jpg"];
let current = 0;

function showSlide(i) {
  const img = document.getElementById("carouselImage");
  if (img) img.src = images[i];
}

function nextSlide() {
  current = (current + 1) % images.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + images.length) % images.length;
  showSlide(current);
}

if (document.getElementById("carouselImage")) {
  showSlide(current);
}

// ===============================
// 🧠 PERSONAL QUIZ LOGIC + CHARTS
// ===============================
const quizData = [
  { question: "How many hours did I work today?", options: ["2", "4", "6", "8", "10+"], answer: null },
  { question: "What types of tasks did I do today?", options: ["Coding", "Meetings", "Documentation", "Debugging", "Learning"], answer: null },
  { question: "Did I take breaks regularly?", options: ["Yes", "No"], answer: null },
  { question: "Was today productive overall?", options: ["Yes", "No", "Neutral"], answer: null }
];

const quizContainer = document.getElementById("quizContainer");
const submitQuiz = document.getElementById("submitQuiz");
const quizResult = document.getElementById("quizResult");

if (quizContainer && submitQuiz && quizResult) {
  quizData.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("quiz-question");
    div.innerHTML = `<p>${index + 1}. ${q.question}</p>` + q.options.map(opt =>
      `<label class="quiz-option">
        <input type="${q.answer === null ? "checkbox" : "radio"}" name="q${index}" value="${opt}"> ${opt}
      </label>`).join('');
    quizContainer.appendChild(div);
  });

  submitQuiz.onclick = () => {
    const results = {};

    quizData.forEach((q, index) => {
      const selectedOptions = document.querySelectorAll(`input[name='q${index}']:checked`);
      results[`q${index}`] = Array.from(selectedOptions).map(opt => opt.value);
    });

    quizResult.textContent = "Summary recorded. See visual breakdown below.";
    showChartsPersonal(results);
  };
}

// ===============================
// 📊 PERSONAL CHART RENDERING
// ===============================
function showChartsPersonal(results) {
  const pieCtx = document.getElementById("quizPieChart")?.getContext("2d");
  const barCtx = document.getElementById("quizBarChart")?.getContext("2d");

  if (!results || !results.q1) return;

  // Count task types
  const taskCounts = {};
  results.q1?.forEach(task => {
    taskCounts[task] = (taskCounts[task] || 0) + 1;
  });

  const taskLabels = Object.keys(taskCounts);
  const taskData = taskLabels.map(label => taskCounts[label]);

  if (pieCtx) {
    new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: taskLabels.length ? taskLabels : ["No tasks selected"],
        datasets: [{
          data: taskData.length ? taskData : [1],
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6610f2"]
        }]
      }
    });
  }

  if (barCtx) {
    const hours = parseInt(results.q0?.[0]) || 0;
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Hours Worked"],
        datasets: [{
          label: "Hours",
          data: [hours],
          backgroundColor: ["#17a2b8"]
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 24 }
        }
      }
    });
  }
}


// ===============================
// 😂 JOKE API
// ===============================
function loadJoke() {
  fetch("https://v2.jokeapi.dev/joke/Programming?type=single")
    .then(res => res.json())
    .then(data => {
      const jokeEl = document.getElementById("jokeCard");
      if (jokeEl) jokeEl.textContent = `"${data.joke}"`;
    })
    .catch(() => {
      const jokeEl = document.getElementById("jokeCard");
      if (jokeEl) jokeEl.textContent = "Failed to load joke.";
    });
}

if (document.getElementById("jokeCard")) loadJoke();
