const questions = [
  {
    id: 1,
    image: "q1.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" }
    ],
    answer: "B"
  },
  {
    id: 2,
    image: "q2.png",
    options: [
      { label: "A", text: "Option A2" },
      { label: "B", text: "Option B2" },
      { label: "C", text: "Option C2" },
      { label: "D", text: "Option D2" }
    ],
    answer: "D"
  }
];

let currentIndex = 0;
let selectedAnswer = null;
let userAnswers = new Array(questions.length).fill(null);
let answered = new Array(questions.length).fill(false);
let score = 0;
let perQuestionTime = new Array(questions.length).fill(0);
let timerInterval;

function startTimer() {
  const timer = document.getElementById("timer");
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    perQuestionTime[currentIndex]++;
    const time = perQuestionTime[currentIndex];
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    timer.textContent = `⏱ ${minutes}:${seconds}`;
  }, 1000);
}

function loadQuestion() {
  clearInterval(timerInterval);
  startTimer();

  const q = questions[currentIndex];
  document.getElementById("questionCount").textContent = `Q${currentIndex + 1}`;
  document.getElementById("questionImage").src = q.image;

  const optionsDiv = document.getElementById("options");
  const resultDiv = document.getElementById("result");

  optionsDiv.innerHTML = "";
  resultDiv.textContent = "";
  selectedAnswer = userAnswers[currentIndex];

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${opt.label}</strong>: ${opt.text}`;
    if (selectedAnswer === opt.label) btn.classList.add("selected");
    if (answered[currentIndex]) btn.disabled = true;

    btn.onclick = () => {
      if (answered[currentIndex]) return;
      selectedAnswer = opt.label;
      document.querySelectorAll(".options button").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    };

    optionsDiv.appendChild(btn);
  });
}

function checkAnswer() {
  const resultDiv = document.getElementById("result");
  if (!selectedAnswer) {
    resultDiv.textContent = "Please select an option.";
    resultDiv.style.color = "#ff9800";
    return;
  }
  if (answered[currentIndex]) return;

  const correct = questions[currentIndex].answer;
  userAnswers[currentIndex] = selectedAnswer;
  answered[currentIndex] = true;

  if (selectedAnswer === correct) {
    score++;
    resultDiv.textContent = "Correct! ✅";
    resultDiv.style.color = "#4caf50";
  } else {
    resultDiv.textContent = `Wrong! ❌ Correct answer: ${correct}`;
    resultDiv.style.color = "#f44336";
  }

  document.querySelectorAll(".options button").forEach(btn => btn.disabled = true);
}

function showSummary() {
  document.getElementById("quizMain").style.display = "none";
  document.getElementById("summary").style.display = "block";
  clearInterval(timerInterval);

  const summaryDiv = document.getElementById("summaryContent");
  const finalScore = document.getElementById("finalScore");

  summaryDiv.innerHTML = "";
  questions.forEach((q, index) => {
    const minutes = String(Math.floor(perQuestionTime[index] / 60)).padStart(2, "0");
    const seconds = String(perQuestionTime[index] % 60).padStart(2, "0");

    const div = document.createElement("div");
    div.classList.add("summary-item");
    div.innerHTML = `
      <p><strong>Q${index + 1}</strong> (🕒 ${minutes}:${seconds})</p>
      <img src="${q.image}" style="max-width: 100%; border-radius: 8px; border: 1px solid #444; margin-bottom: 0.5rem;" />
      <p>Your Answer: <strong>${userAnswers[index] || "Not Answered"}</strong></p>
      <p>Correct Answer: <strong>${q.answer}</strong></p>
      <hr/>
    `;
    summaryDiv.appendChild(div);
  });

  finalScore.textContent = `✅ You scored ${score} / ${questions.length}`;
}

window.onload = () => {
  loadQuestion();

  document.getElementById("checkBtn").onclick = checkAnswer;
  document.getElementById("nextBtn").onclick = () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion();
    } else {
      showSummary();
    }
  };

  document.getElementById("prevBtn").onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      loadQuestion();
    }
  };

  document.getElementById("retryBtn").onclick = () => {
    currentIndex = 0;
    score = 0;
    selectedAnswer = null;
    answered = new Array(questions.length).fill(false);
    userAnswers = new Array(questions.length).fill(null);
    perQuestionTime = new Array(questions.length).fill(0);
    clearInterval(timerInterval);
    document.getElementById("summary").style.display = "none";
    document.getElementById("quizMain").style.display = "block";
    loadQuestion();
  };
};
