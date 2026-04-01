/**
 * STEP 0: INITIAL QUIZ & READING ANALYSIS
 */

function renderInitialQuiz(s) {
  const qBox = document.getElementById('initial-quiz-box');
  if (!qBox) return;
  
  if (AppState.isDiagnosticDone) {
    qBox.classList.remove('active');
    return;
  }
  
  qBox.classList.add('active');
  qBox.innerHTML = '';
  
  const qData = s.steps.initial;
  const title = document.createElement('h3');
  title.textContent = qData.question;
  qBox.appendChild(title);

  const opts = document.createElement('div');
  opts.className = 'quiz-options';
  
  qData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.onclick = () => checkInitialQuiz(btn, idx, qData.ans);
    opts.appendChild(btn);
  });
  qBox.appendChild(opts);
}

function checkInitialQuiz(btn, idx, correct) {
  const btns = btn.parentElement.querySelectorAll('button');
  btns.forEach(b => b.disabled = true);
  
  if (idx === correct) {
    btn.classList.add('correct');
    showToast("🎉 정답입니다! 학습 난이도가 '중'으로 설정되었습니다.");
    AppState.isDiagnosticDone = true;
    
    setTimeout(() => {
      document.getElementById('initial-quiz-box').classList.remove('active');
      AppState.unlockedStages[0] = true;
      setStage(0);
      const progCard = document.getElementById('student-progress-card');
      if (progCard) progCard.style.display = 'block';
    }, 1000);
  } else {
    btn.classList.add('wrong');
    showToast("❌ 오답입니다. 기본 학습 단계로 시작합니다.");
    AppState.isDiagnosticDone = true;
    btns[correct].classList.add('correct');
    setTimeout(() => {
      document.getElementById('initial-quiz-box').classList.remove('active');
      AppState.unlockedStages[0] = true;
      setStage(0);
    }, 1500);
  }
}

function renderReadAnalysis(s) {
  const el = document.getElementById('read-box');
  if (el) el.innerHTML = `<div class="sent-en">${s.en}</div><div class="sent-ko">${s.ko}</div>`;
}
