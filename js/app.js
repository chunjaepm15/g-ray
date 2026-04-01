/**
 * GRAMMAR VIEWER CORE LOGIC (v12)
 * State management & Role separation
 */

const AppState = {
  mode: 'teacher', // 'teacher' or 'student'
  currentUnit: 1,
  currentSentIdx: 0,
  currentStage: 0, 
  unlockedStages: [true, false, false, false, false],
  wrongAnswers: [], // To store incorrect sentences
  history: [], 
  timer: null,
  timeLeft: 300, // 5 minutes
  isBeamMode: false,
  isDiagnosticDone: false
};

/**
 * Initialize App
 */
function initApp() {
  renderSidebar();
  setMode('teacher');
  loadUnit(1);
  setupEventListeners();
  startClock();
}

/**
 * Set User Mode
 */
function setMode(mode) {
  AppState.mode = mode;
  document.body.className = `mode-${mode}`;
  
  // Update Header UI
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('on'));
  const targetBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (targetBtn) targetBtn.classList.add('on');

  // Handle Visibility
  if (mode === 'student') {
    goScreen('learn');
  } else {
    goScreen('dashboard');
  }
}

/**
 * Beam Mode Toggle
 */
function toggleBeamMode() {
  AppState.isBeamMode = !AppState.isBeamMode;
  document.body.classList.toggle('beam-mode', AppState.isBeamMode);
  if (AppState.isBeamMode) {
    showToast("🔦 빔프로젝트 모드가 활성화되었습니다. (Esc로 종료)");
  }
}

// Esc to exit beam mode
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && AppState.isBeamMode) toggleBeamMode();
});

/**
 * Teacher: Teacher Memo
 */
function toggleTeacherMemo() {
  const panel = document.getElementById('teacher-memo-panel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

/**
 * G-ray Analyzer Engine (Simplified from Backup)
 */
function runAnalyzer() {
  const text = document.getElementById('analyzer-input').value;
  if (!text.trim()) return showToast("분석할 텍스트를 입력하세요.");
  
  const words = text.split(/\s+/).length;
  const grade = (words / 15 + Math.random()).toFixed(1); // Mock calculation
  const oov = Math.floor(Math.random() * 20);
  
  document.getElementById('analyzer-result').style.display = 'block';
  document.getElementById('res-grade').textContent = grade;
  document.getElementById('res-oov').textContent = oov + '%';
  
  if (oov > 15) showToast("⚠️ 이탈 어휘가 많습니다! 리라이팅을 권장합니다.");
}

/**
 * Teacher Profile Modal & Charts
 */
let profileCharts = [];

function openProfileModal(name) {
  const modal = document.getElementById('profile-modal');
  document.getElementById('prof-name').textContent = name;
  document.getElementById('prof-avatar').textContent = name.charAt(0);
  modal.style.display = 'flex';
  
  setTimeout(renderProfileCharts, 300);
}

function closeProfileModal() {
  document.getElementById('profile-modal').style.display = 'none';
  profileCharts.forEach(c => c.destroy());
  profileCharts = [];
}

function renderProfileCharts() {
  if (profileCharts.length > 0) return;
  
  // Radar Chart
  const ctxRadar = document.getElementById('radarChart')?.getContext('2d');
  if (ctxRadar) {
    profileCharts.push(new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: ['구조분석', '문법응용', '영작완결', '끈기지수', '어휘적응'],
        datasets: [{
          label: '학생 역량',
          data: [85, 60, 75, 90, 80],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          pointBackgroundColor: 'rgba(59, 130, 246, 1)'
        }]
      },
      options: { scales: { r: { min: 0, max: 100 } } }
    }));
  }

  // Bar Chart
  const ctxBar = document.getElementById('barChart')?.getContext('2d');
  if (ctxBar) {
    profileCharts.push(new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['L1', 'L2', 'L3', 'L4', 'L5'],
        datasets: [{
          label: '정답률',
          data: [90, 75, 45, 80, 65],
          backgroundColor: 'rgba(16, 185, 129, 0.8)'
        }]
      },
      options: { indexAxis: 'y', scales: { x: { min: 0, max: 100 } } }
    }));
  }
}

/**
 * Navigation
 */
function goScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('on');
    // Update Rail highlight
    document.querySelectorAll('.rail-btn').forEach(btn => btn.classList.remove('active'));
    const railBtn = document.querySelector(`.rail-btn[data-screen="${screenId}"]`);
    if (railBtn) railBtn.classList.add('active');
  }
}

/**
 * Load Unit Data
 */
function loadUnit(unitId) {
  AppState.currentUnit = unitId;
  AppState.currentSentIdx = 0;
  AppState.currentStage = 0;
  AppState.unlockedStages = [true, false, false, false, false];
  AppState.isDiagnosticDone = false; // Reset for each unit
  
  renderSentences();
  renderCurrentSentence();
  renderSidebar();
}

/**
 * Render Sidebars & Lists
 */
function renderSidebar() {
  const list = document.getElementById('unit-list');
  if (!list) return;
  list.innerHTML = '';
  
  GRAMMAR_UNITS.forEach(unit => {
    const item = document.createElement('div');
    item.className = `unit-item ${AppState.currentUnit === unit.id ? 'on' : ''}`;
    item.innerHTML = `
      <div class="unit-name">${unit.title}</div>
      <div class="unit-sub">${unit.concepts.join(', ')}</div>
    `;
    item.onclick = () => {
      loadUnit(unit.id);
      renderSidebar();
    };
    list.appendChild(item);
  });
}

function renderSentences() {
  const container = document.getElementById('sent-list');
  if (!container) return;
  container.innerHTML = '';
  
  const sentences = getEnhancedSentences(AppState.currentUnit);
  sentences.forEach((s, idx) => {
    const item = document.createElement('div');
    item.className = 'sent-item-small';
    item.innerHTML = `
      <span class="badge-diff diff-${s.difficulty === '하' ? 'low' : s.difficulty === '중' ? 'mid' : 'high'}">${s.difficulty}</span>
      <span class="sent-txt">${s.en}</span>
    `;
    item.onclick = () => {
      AppState.currentSentIdx = idx;
      renderCurrentSentence();
    };
    container.appendChild(item);
  });
}

/**
 * Render Learning Screen Content
 */
function renderCurrentSentence() {
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  if (!s) return;

  const displays = document.querySelectorAll('.active-sent-en');
  displays.forEach(d => d.textContent = s.en);
  const trans = document.querySelectorAll('.active-sent-ko');
  trans.forEach(t => t.textContent = s.ko);

  const diffTag = document.getElementById('current-diff-tag');
  if (diffTag) {
    diffTag.textContent = `난이도: ${s.difficulty}`;
    diffTag.className = `badge-diff diff-${s.difficulty === '하' ? 'low' : s.difficulty === '중' ? 'mid' : 'high'}`;
  }

  // Initial Quiz Logic
  renderInitialQuiz(s);
  
  // Specific Stage Rendering
  updateStageUI();
}

function updateStageUI() {
  const stage = AppState.currentStage;
  document.querySelectorAll('.learn-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(`pane-stage-${stage}`);
  if (target) target.style.display = 'block';

  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];

  if (stage === 1) renderChopUI(s);
  if (stage === 2) renderRearrangeUI(s);
  if (stage === 3) renderBlankUI(s);
  if (stage === 4) renderWriteUI(s);
}

/**
 * Stage Navigation
 */
function setStage(stage) {
  if (!AppState.unlockedStages[stage]) return;
  AppState.currentStage = stage;
  updateStageTabs();
  updateStageUI();
}

function unlockNextStage() {
  if (AppState.currentStage < 4) {
    AppState.unlockedStages[AppState.currentStage + 1] = true;
    setStage(AppState.currentStage + 1);
  } else {
    showToast("🎉 학습 완료! 다음 문장으로 넘어갑니다.");
    nextSentence();
  }
}

function nextSentence() {
  const sentences = getEnhancedSentences(AppState.currentUnit);
  if (AppState.currentSentIdx < sentences.length - 1) {
    AppState.currentSentIdx++;
    AppState.currentStage = 0;
    AppState.unlockedStages = [true, false, false, false, false];
    renderCurrentSentence();
    updateStageTabs();
  } else {
    showToast("🏆 단원의 모든 학습을 마쳤습니다!");
  }
}

function updateStageTabs() {
  for (let i = 0; i < 5; i++) {
    const tab = document.getElementById(`st-tab-${i}`);
    if (!tab) continue;
    tab.classList.toggle('active', AppState.currentStage === i);
    tab.classList.toggle('locked', !AppState.unlockedStages[i]);
  }
}

/**
 * Event Listeners
 */
function setupEventListeners() {
  // Navigation Sidebar
  document.getElementById('sb-search')?.addEventListener('input', (e) => {
    // Filter units or sentences...
  });
}

/**
 * Utility Tools
 */
function startClock() {
  setInterval(() => {
    const now = new Date();
    const clock = document.getElementById('util-clock');
    if (clock) clock.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }, 30000);
}

function toggleTimer() {
  const btn = document.getElementById('timer-btn');
  if (AppState.timer) {
    clearInterval(AppState.timer);
    AppState.timer = null;
    btn.textContent = "⏱ 타이머 시작";
  } else {
    AppState.timer = setInterval(() => {
      AppState.timeLeft--;
      renderTimer();
      if (AppState.timeLeft <= 0) {
        clearInterval(AppState.timer);
        AppState.timer = null;
        showToast("⏰ 시간 종료!");
      }
    }, 1000);
    btn.textContent = "⏱ 타이머 중지";
  }
}

function renderTimer() {
  const el = document.getElementById('util-timer');
  const m = Math.floor(AppState.timeLeft / 60);
  const s = AppState.timeLeft % 60;
  if (el) el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

function showToast(msg) {
  const toast = document.getElementById('global-toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('on');
    setTimeout(() => toast.classList.remove('on'), 3000);
  }
}

/**
 * WRONG ANSWER MANAGEMENT
 */
function addToWrongList(s) {
  if (!AppState.wrongAnswers.some(ans => ans.en === s.en)) {
    AppState.wrongAnswers.push(s);
    renderWrongList();
  }
}

function renderWrongList() {
  const container = document.getElementById('wrong-list-container');
  if (!container) return;
  
  if (AppState.wrongAnswers.length === 0) {
    container.innerHTML = '<p class="mute">틀린 문제가 없습니다. 완벽해요! ✨</p>';
    return;
  }
  
  container.innerHTML = '';
  AppState.wrongAnswers.forEach(s => {
    const item = document.createElement('div');
    item.className = 'unit-item';
    item.style.borderBottom = '1px solid var(--bd)';
    item.innerHTML = `
      <div class="unit-name">${s.en}</div>
      <div class="unit-sub">${s.ko}</div>
    `;
    container.appendChild(item);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.addEventListener('DOMContentLoaded', initApp);
