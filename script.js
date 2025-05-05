const mainScreen = document.getElementById("main-screen");
const loader = document.getElementById("loader");
const form = document.getElementById("quiz-form");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const warning = document.getElementById("warning");
const endScreen = document.getElementById("end-screen");
const scoreEl = document.getElementById("score");
const reviewBtn = document.getElementById("review-btn");
const restartBtn = document.getElementById("restart-btn");
const restartBtn2 = document.getElementById("restart-btn2");
const reviewScreen = document.getElementById("review-screen");
const reviewList = document.getElementById("review-list");

let questions = [],
  current = 0,
  score = 0,
  selected = null,
  answers = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mainScreen.classList.add("hidden");
  loader.classList.remove("hidden");
  const num = document.getElementById("num-questions").value;
  const cat = getCategory(document.getElementById("category").value);
  const diff = document.getElementById("difficulty").value;

  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`
    );
    const data = await res.json();
    questions = data.results.map((q) => ({
      question: decode(q.question),
      options: shuffle([
        ...q.incorrect_answers.map(decode),
        decode(q.correct_answer),
      ]),
      answer: decode(q.correct_answer),
    }));
    current = score = 0;
    answers = [];
    loader.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    showQuestion();
  } catch {
    alert("Failed to load quiz.");
    loader.classList.add("hidden");
  }
});

function showQuestion() {
  const q = questions[current];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className =
      "block w-full text-left px-4 py-2 border rounded hover:bg-blue-100";
    btn.onclick = () => {
      selected = opt;
      Array.from(optionsEl.children).forEach((b) =>
        b.classList.remove("bg-blue-200")
      );
      btn.classList.add("bg-blue-200");
    };
    optionsEl.appendChild(btn);
  });
}

nextBtn.onclick = () => {
  if (!selected) {
    warning.classList.remove("hidden");
    return;
  }
  warning.classList.add("hidden");
  const q = questions[current];
  if (selected === q.answer) score++;
  answers.push({
    question: q.question,
    correct: q.answer,
    selected: selected,
  });
  selected = null;
  if (++current < questions.length) {
    showQuestion();
  } else {
    quizScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    scoreEl.textContent = `Correct ${score} of ${questions.length}`;
  }
};

reviewBtn.onclick = () => {
  endScreen.classList.add("hidden");
  reviewScreen.classList.remove("hidden");
  reviewList.innerHTML = answers
    .map(
      (a) => `
    <div class="p-4 border rounded-md">
      <p class="font-semibold">Q: ${a.question}</p>
      <p class="text-green-600">Correct: ${a.correct}</p>
      <p class="${
        a.selected === a.correct ? "text-green-600" : "text-red-600"
      }">Your Answer: ${a.selected}</p>
    </div>
  `
    )
    .join("");
};

restartBtn.onclick = restartBtn2.onclick = () => {
  reviewScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};

function decode(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCategory(type) {
  const map = {
    "General Knowledge": 9,
    Film: 11,
    Music: 12,
    "Video Games": 15,
    "Board Games": 16,
    "Science & Nature": 17,
    Computers: 18,
    Maths: 19,
    Sports: 21,
    Geography: 22,
    History: 23,
    Celebrities: 26,
    Animals: 27,
  };
  return map[type];
}
