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
// 🧠 QUIZ LOGIC + CHARTS
// ===============================
const quizData = [
  { question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HyperText Markdown Language"], answer: "HyperText Markup Language" },
  { question: "Which property is used for background color in CSS?", options: ["color", "background-color", "bgcolor"], answer: "background-color" },
  { question: "What does DOM stand for?", options: ["Document Object Model", "Digital Object Module", "Data Object Map"], answer: "Document Object Model" },
  { question: "What tag is used for JavaScript?", options: ["<script>", "<js>", "<javascript>"], answer: "<script>" },
  { question: "Which CSS property controls text size?", options: ["font-style", "text-size", "font-size"], answer: "font-size" },
  { question: "Which function displays output in the browser console?", options: ["alert()", "log()", "console.log()"], answer: "console.log()" },
  { question: "What does CSS stand for?", options: ["Color Style Sheets", "Cascading Style Sheets", "Creative Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "What symbol is used for comments in JavaScript?", options: ["//", "#", "/* */"], answer: "//" },
  { question: "What layout system uses rows and columns?", options: ["Flexbox", "CSS Grid", "Table"], answer: "CSS Grid" },
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
        <input type="radio" name="q${index}" value="${opt}"> ${opt}
      </label>`).join('');
    quizContainer.appendChild(div);
  });

  submitQuiz.onclick = () => {
    let score = 0;
    quizData.forEach((q, index) => {
      const selected = document.querySelector(`input[name='q${index}']:checked`);
      const options = document.querySelectorAll(`input[name='q${index}']`);

      options.forEach(option => {
        const parent = option.parentElement;
        parent.classList.remove("correct", "incorrect");
        if (option.value === q.answer) {
          parent.classList.add("correct");
        } else if (option.checked) {
          parent.classList.add("incorrect");
        }
      });

      if (selected && selected.value === q.answer) score++;
    });

    quizResult.textContent = `You scored ${score} out of ${quizData.length}`;
    showCharts(score, quizData.length - score);
  };
}

// ===============================
// 📊 CHART RENDERING
// ===============================
function showCharts(correct, incorrect) {
  const pieCtx = document.getElementById("quizPieChart")?.getContext("2d");
  const barCtx = document.getElementById("quizBarChart")?.getContext("2d");

  if (pieCtx) {
    new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["Correct", "Incorrect"],
        datasets: [{
          data: [correct, incorrect],
          backgroundColor: ["#28a745", "#dc3545"]
        }]
      }
    });
  }

  if (barCtx) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Correct", "Incorrect"],
        datasets: [{
          label: "Score",
          data: [correct, incorrect],
          backgroundColor: ["#007bff", "#ffc107"]
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 10 }
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
