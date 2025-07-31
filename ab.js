const questions = [
  {
    id: 1,
    image: "q1.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    answer: "C",
  },
  {
    id: 2,
    image: "q2.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    answer: "B",
  },
  {
    id: 3,
    image: "q3.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    answer: "2",
  },
  {
    id: 4,
    image: "q4.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    answer: "B",
  },
  {
    id: 5,
    image: "q5.png",
    options: [
      { label: "A", text: "Option A" },
      { label: "B", text: "Option B" },
      { label: "C", text: "Option C" },
      { label: "D", text: "Option D" },
    ],
    answer: "C",
  },
];

let currentIndex = 0;
let selectedAnswer = null;
let userAnswers = new Array(questions.length).fill(null);
let answered = new Array(questions.length).fill(false);
let markedForReview = new Array(questions.length).fill(false);
let perQuestionTime = new Array(questions.length).fill(0);
let timerInterval;
let score = 0;

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    perQuestionTime[currentIndex]++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const seconds = perQuestionTime[currentIndex];
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `⏱ ${min}:${sec}`;
}

function loadQuestion() {
  const q = questions[currentIndex];
  selectedAnswer = userAnswers[currentIndex];

  document.getElementById("questionCount").textContent = `Q${currentIndex + 1}`;
  const imageContainer = document.querySelector(".image-container");
  imageContainer.innerHTML = ""; // Clear previous content

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-wrapper";

  const img = document.createElement("img");
  img.src = q.image;
  imageWrapper.appendChild(img);

  const zoomBtn = document.createElement("button");
  zoomBtn.textContent = "🔍";
  zoomBtn.className = "zoom-button";
  zoomBtn.title = "Click to enlarge image";
  zoomBtn.onclick = openModal;

  imageWrapper.appendChild(zoomBtn);
  imageContainer.appendChild(imageWrapper);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  document.getElementById("result").textContent = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${opt.label}</strong>: ${opt.text}`;
    if (selectedAnswer === opt.label) {
      btn.classList.add("selected");
    }
    btn.onclick = () => {
      if (!answered[currentIndex]) {
        selectedAnswer = opt.label;
        userAnswers[currentIndex] = selectedAnswer;
        document
          .querySelectorAll(".options button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      }
    };
    optionsDiv.appendChild(btn);
  });

  updateTimer();
  startTimer();
  updateQuestionGrid();
}

function checkAnswer() {
  if (selectedAnswer === null) {
    alert("Please select an option first.");
    return;
  }

  answered[currentIndex] = true;
  clearInterval(timerInterval);

  const resultDiv = document.getElementById("result");
  const correct = questions[currentIndex].answer;

  if (selectedAnswer === correct) {
    score++;
    resultDiv.textContent = "✅ Correct!";
    resultDiv.className = "result correct-answer";
  } else {
    resultDiv.textContent = `❌ Incorrect! Correct: ${correct}`;
    resultDiv.className = "result wrong-answer";
  }

  updateQuestionGrid();
}

function updateQuestionGrid() {
  const grid = document.getElementById("questionGrid");
  grid.innerHTML = "";

  questions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;

    if (answered[i]) {
      if (userAnswers[i] === questions[i].answer) {
        btn.classList.add("answered", "flash-green");
      } else {
        btn.classList.add("wrong");
      }
    }

    if (markedForReview[i]) btn.classList.add("marked", "pulse-purple");
    if (i === currentIndex) btn.classList.add("selected");

    btn.onclick = () => {
      currentIndex = i;
      loadQuestion();
    };

    grid.appendChild(btn);
  });
}

function showSubmitPage() {
  clearInterval(timerInterval);
  document.getElementById("quizMain").style.display = "none";
  document.getElementById("submitPage").style.display = "block";
}

function goBackFromSubmit() {
  document.getElementById("submitPage").style.display = "none";
  document.getElementById("quizMain").style.display = "block";
  loadQuestion();
}

function showSummary() {
  clearInterval(timerInterval);
  document.getElementById("submitPage").style.display = "none";
  document.getElementById("summary").style.display = "block";

  const totalSeconds = perQuestionTime.reduce((a, b) => a + b, 0);
  const totalMin = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const totalSec = String(totalSeconds % 60).padStart(2, "0");
  document.getElementById(
    "timer"
  ).textContent = `⏱ Total Time: ${totalMin}:${totalSec}`;
  document.getElementById(
    "finalScore"
  ).textContent = `✅ You scored ${score} / ${questions.length} | ⏱ Total Time: ${totalMin}:${totalSec}`;

  const summaryDiv = document.getElementById("summaryContent");
  summaryDiv.innerHTML = "";

  questions.forEach((q, idx) => {
    const time = perQuestionTime[idx];
    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    const userAns = userAnswers[idx] || "Not Answered";
    const isCorrect = userAnswers[idx] === q.answer;

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Q${idx + 1} ⏱ (${min}:${sec})</h3>
      <img src="${q.image}" alt="Q${
      idx + 1
    }" style="max-width:100%;border:1px solid #aaa; border-radius:5px;">
      <p><strong>Your Answer:</strong> 
        <span class="${
          isCorrect ? "correct-text" : "wrong-text"
        }">${userAns}</span>
      </p>
      <p><strong>Correct Answer:</strong> 
        <span class="correct-text">${q.answer}</span>
      </p>
      <hr/>
    `;
    summaryDiv.appendChild(div);
  });
}

function retryQuiz() {
  location.reload();
}

document.getElementById("nextBtn").onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    showSubmitPage();
  }
};

document.getElementById("prevBtn").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
  }
};

document.getElementById("checkBtn").onclick = checkAnswer;
document.getElementById("markReviewBtn").onclick = () => {
  markedForReview[currentIndex] = !markedForReview[currentIndex];
  const btn = document.getElementById("markReviewBtn");

  btn.classList.add("pulse-purple");
  setTimeout(() => btn.classList.remove("pulse-purple"), 1000);

  updateQuestionGrid();
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clearBtn").addEventListener("click", () => {
    // Don't allow clearing after checking
    if (answered[currentIndex]) return;

    selectedAnswer = null;
    userAnswers[currentIndex] = null;

    const optionButtons = document.querySelectorAll(".options button");
    optionButtons.forEach((b) => b.classList.remove("selected"));

    document.getElementById("result").textContent = "";
    updateQuestionGrid();
  });
});

function openModal() {
  const modal = document.getElementById("imageModal");
  const enlargedImg = document.getElementById("enlargedImg");
  const q = questions[currentIndex];
  enlargedImg.src = q.image;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function openModal() {
  const modal = document.getElementById("imageModal");
  const enlargedImg = document.getElementById("enlargedImg");
  enlargedImg.src = questions[currentIndex].image;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}


let isZoomed = false;

document.getElementById("enlargedImg").addEventListener("click", function () {
  if (!isZoomed) {
    this.style.transform = "scale(1.8)";
    this.style.cursor = "zoom-out";
    isZoomed = true;
  } else {
    this.style.transform = "scale(1)";
    this.style.cursor = "zoom-in";
    isZoomed = false;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
});
