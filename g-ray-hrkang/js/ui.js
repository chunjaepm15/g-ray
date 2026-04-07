/**
 * GRAMMAR VIEWER UI HANDLERS (v12)
 * Learning stages: Initial Quiz, Read, Chop, Rearrange, Blank, Write
 */

/**
 * INITIAL QUIZ (이지선다)
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
      // After correct, move to Step 0 Reading & Analysis
      document.getElementById('initial-quiz-box').classList.remove('active');
      AppState.unlockedStages[0] = true;
      setStage(0);
      // Show progress card for student
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

/**
 * STEP 0: READING & ANALYSIS
 */
function renderReadAnalysis(s) {
  const el = document.getElementById('read-box');
  if (el) el.innerHTML = `<div class="sent-en">${s.en}</div><div class="sent-ko">${s.ko}</div>`;
}

/**
 * STEP 1: CHOP (Sentence Cutting)
 */
function renderChopUI(s) {
  const wrap = document.getElementById('chop-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  const tokens = s.steps.chop.tokens;
  tokens.forEach((tok, i) => {
    const chip = document.createElement('span');
    chip.className = 'chop-chip';
    chip.textContent = tok;
    wrap.appendChild(chip);
    
    if (i < tokens.length - 1) {
      const g = document.createElement('span');
      g.className = 'chop-gap';
      g.dataset.idx = i;
      g.onclick = () => toggleChop(g);
      wrap.appendChild(g);
    }
  });
}

function toggleChop(el) {
  el.classList.toggle('cut');
  // Simple check: if at least one cut, allow next
  const cuts = document.querySelectorAll('.chop-gap.cut').length;
  if (cuts > 0) {
    document.getElementById('chop-next-btn')?.classList.remove('locked');
  }
}

/**
 * STEP 2: REARRANGE (Drag & Drop)
 */
let dragCurrentTiles = [];
function renderRearrangeUI(s) {
  const container = document.getElementById('rearrange-bank');
  const target = document.getElementById('rearrange-target');
  if (!container || !target) return;
  
  container.innerHTML = '';
  target.innerHTML = '';
  
  dragCurrentTiles = shuffle([...s.steps.rearrange.tiles]);
  dragCurrentTiles.forEach(tile => {
    const el = createTileEl(tile);
    container.appendChild(el);
  });
}

function createTileEl(tile) {
  const el = document.createElement('div');
  el.className = 'chip';
  el.textContent = tile.t;
  el.onclick = () => moveTile(el);
  return el;
}

function moveTile(el) {
  const bank = document.getElementById('rearrange-bank');
  const target = document.getElementById('rearrange-target');
  if (el.parentElement === bank) target.appendChild(el);
  else bank.appendChild(el);
  
  checkRearrange();
}

function checkRearrange() {
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  const target = document.getElementById('rearrange-target');
  const userAns = Array.from(target.children).map(c => c.textContent).join(' ');
  const correct = s.steps.rearrange.ans.join(' ');
  const btn = document.getElementById('rearrange-next-btn');

  if (userAns.trim() === correct.trim()) {
    Array.from(target.children).forEach(c => c.classList.add('correct'));
    showToast("✓ 문법 구조에 맞는 완벽한 어순입니다!");
    if (btn) btn.classList.remove('locked');
  } else {
    if (btn) btn.classList.add('locked');
  }
}

/**
 * STEP 3: BLANK
 */
function renderBlankUI(s) {
  const q = document.getElementById('blank-sent');
  if (q) q.innerHTML = s.steps.blank.sent;
  const input = document.getElementById('blank-input');
  if (input) {
    input.value = '';
    input.placeholder = "내용을 입력하세요...";
  }
}

function checkBlank() {
  const input = document.getElementById('blank-input');
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  
  if (input.value.trim().toLowerCase() === s.steps.blank.ans.toLowerCase()) {
    input.classList.add('correct');
    showToast("✓ 정답입니다!");
    setTimeout(unlockNextStage, 1000);
  } else {
    input.classList.add('wrong');
    showToast("✗ 다시 생각해보세요.");
  }
}

/**
 * STEP 4: DIRECT WRITE
 */
function renderWriteUI(s) {
  const ko = document.getElementById('write-ko');
  if (ko) ko.textContent = s.ko;
}

function checkWrite() {
  const input = document.getElementById('write-input');
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  
  if (input.value.trim().toLowerCase().replace(/[.,!?;]/g, '') === s.en.toLowerCase().replace(/[.,!?;]/g, '')) {
    input.classList.add('correct');
    showToast("✓ 완벽한 문장입니다! 축하합니다.");
    setTimeout(unlockNextStage, 1000);
  } else {
    input.classList.add('wrong');
    showToast("✗ 오답입니다. 대소문자나 철자를 확인하세요.");
  }
}

/**
 * UTILS
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
