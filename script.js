const params = new URLSearchParams(window.location.search);
const anime = params.get("anime");

import(`./data/${anime}.js`).then(module => {
  const allQuestions = module.questions;
  const quizImage = `assets/${anime}.jpg`;
  document.getElementById("quiz-body").style.background = `url('${quizImage}') center/cover no-repeat fixed`;
  document.getElementById("quiz-title").innerText = `${anime.charAt(0).toUpperCase() + anime.slice(1)} Quiz`;

  const questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
  let current = 0;
  let score = 0;
  let isAnswering = false;

  const qText = document.getElementById("question-text");
  const optionBtns = document.querySelectorAll(".option");
  const resultBox = document.getElementById("result-box");
  const questionBox = document.getElementById("question-box");
  const progressText = document.createElement("div");
  progressText.className = "progress-text";
  questionBox.insertBefore(progressText, qText);

  function updateProgress() {
    progressText.textContent = `Question ${current + 1} of 10`;
  }

  function disableButtons() {
    optionBtns.forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    });
  }

  function enableButtons() {
    optionBtns.forEach(btn => {
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
      btn.classList.remove('correct', 'incorrect');
    });
  }

  function loadQuestion() {
    if (current >= questions.length) {
      showResult();
      return;
    }

    isAnswering = false;
    enableButtons();
    updateProgress();

    const q = questions[current];
    qText.innerText = q.question;
    
    // Log the current question and answer for debugging
    console.log('Current Question:', {
      question: q.question,
      correctAnswer: q.answer,
      options: q.options
    });
    
    optionBtns.forEach((btn, i) => {
      btn.innerText = q.options[i];
      btn.onclick = () => {
        if (isAnswering) return;
        isAnswering = true;
        
        const selectedAnswer = btn.innerText.trim();
        const correctAnswer = q.answer.trim();
        
        // Log the comparison for debugging
        console.log('Answer Check:', {
          selected: selectedAnswer,
          correct: correctAnswer,
          isMatch: selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()
        });
        
        const isCorrect = selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();
        
        if (isCorrect) {
          score++;
          btn.classList.add('correct');
          console.log('Correct answer! Score:', score);
        } else {
          btn.classList.add('incorrect');
          // Show the correct answer
          optionBtns.forEach(b => {
            if (b.innerText.trim().toLowerCase() === correctAnswer.toLowerCase()) {
              b.classList.add('correct');
            }
          });
          console.log('Incorrect answer. Correct was:', correctAnswer);
        }

        disableButtons();
        
        setTimeout(() => {
          current++;
          loadQuestion();
        }, 1500);
      };
    });
  }

  function showResult() {
    questionBox.style.display = "none";
    resultBox.style.display = "block";
    
    let message = '';
    if (score === 10) {
      message = '🎉 Perfect Score! You\'re a true anime master! 🏆';
    } else if (score >= 7) {
      message = '🎉 Great job! You really know your anime! 🌟';
    } else if (score >= 5) {
      message = '👍 Good effort! Keep watching and try again! 💪';
    } else {
      message = '📺 Time to binge-watch some more anime! 🍿';
    }
    
    resultBox.innerHTML = `
      <h2>${message}</h2>
      <p class="score-text">You scored ${score} out of 10!</p>
      <button onclick="window.location.href='index.html'" class="restart-btn">Try Another Quiz</button>
    `;
  }

  loadQuestion();
});
