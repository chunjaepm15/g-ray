/**
 * CORE LOGIC (v12-2)
 * Improved for accordion navigation and specific requirements.
 */

const AppState = {
  mode: 'teacher',
  currentUnit: 1,
  currentScreen: 'dashboard',
  timer: null,
  timeLeft: 300,
  teacherMemo: '',
  studentHintsUsed: {}, // Tracking per unit
  loadedExtraSentences: {}, 
  curStage: 0, 
  stageUnlocked: [true, false, false, false, false],
  isBeamMode: false,
  wrongCount: 0, // Track mistakes for AI review
  lastLesson: { subId: "1-1", stage: 0 }, // Lesson state persistence
};

function init() {
  renderUnits();
  setMode('teacher');
  startClock();
  setupClickOut();
}

function setMode(mode) {
  AppState.currentMode = mode;
  
  // Update Buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('on', btn.id === `mode-${mode}`);
  });

  const teacherElems = document.querySelectorAll('.teacher-only');
  const studentElems = document.querySelectorAll('.student-only');

  if (mode === 'teacher') {
    teacherElems.forEach(el => el.style.display = '');
    studentElems.forEach(el => el.style.display = 'none');
    goScreen('dashboard');
  } else {
    teacherElems.forEach(el => el.style.display = 'none');
    studentElems.forEach(el => el.style.display = '');
    goScreen('student-home');
  }
}

function toggleTimer() {
  const btn = document.getElementById('timer-btn') || document.getElementById('timer-btn-teacher');
  const timerDisplay = document.getElementById('util-timer');
  
  if (AppState.timer) {
    clearInterval(AppState.timer);
    AppState.timer = null;
    if (btn) btn.textContent = "⏱ 타이머 시작";
    if (timerDisplay) timerDisplay.classList.remove('active');
  } else {
    AppState.timer = setInterval(() => {
      AppState.timeLeft--;
      renderTimer();
      if (AppState.timeLeft <= 0) {
        clearInterval(AppState.timer);
        AppState.timer = null;
        if (timerDisplay) timerDisplay.classList.remove('active');
        showToast("⏰ 시간 종료!");
      }
    }, 1000);
    if (btn) btn.textContent = "⏱ 타이머 중지";
    if (timerDisplay) timerDisplay.classList.add('active');
  }
}

function toggleUnit(id) {
  const items = document.querySelectorAll('.unit-item');
  items.forEach(item => {
    const itemId = parseInt(item.getAttribute('data-id'));
    if (itemId === id) {
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        AppState.currentUnit = id;
        // Scroll unit into view if needed
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      item.classList.remove('active');
    }
  });
}

function goScreen(screenId) {
  AppState.currentScreen = screenId;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.add('on');
  
  document.querySelectorAll('.rail-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-screen') === screenId);
  });
}

function renderUnits() {
  const container = document.getElementById('unit-list');
  if (!container) return;
  container.innerHTML = '';
  
  GRAMMAR_UNITS.forEach(unit => {
    const unitEl = document.createElement('div');
    unitEl.className = `unit-item ${AppState.currentUnit === unit.id ? 'active' : ''}`;
    unitEl.setAttribute('data-id', unit.id);
    
    unitEl.innerHTML = `
      <div class="unit-header" onclick="toggleUnit(${unit.id})">
        <div class="unit-name">${unit.title}</div>
        <div class="unit-arrow">˃</div>
      </div>
      <div class="unit-content">
        ${unit.subUnits.map(sub => `<div class="step-item" onclick="selectSubUnit('${sub.id}')">${sub.title}</div>`).join('')}
      </div>
    `;
    container.appendChild(unitEl);
  });
}

function selectSubUnit(subId, startStage = 0) {
  const sub = findSubUnit(subId);
  if (sub) {
    AppState.currentSubUnit = subId;
    AppState.curStage = startStage;
    
    // Unlock stages up to startStage
    AppState.stageUnlocked = [true, false, false, false, false];
    for (let i = 0; i <= startStage; i++) AppState.stageUnlocked[i] = true;

    const unitData = (typeof CURRICULUM_DATA !== 'undefined' && CURRICULUM_DATA[subId]) 
                   ? CURRICULUM_DATA[subId][0] 
                   : null;

    if (unitData) {
      injectStageData(unitData);
      showToast(`📚 교과서 지문을 기반으로 지난 학습(${subId})을 재개합니다.`);
    }
    
    goScreen('learn');
    goStage(startStage);
    updateStageTabs();
  }
}

function resumeLastLesson() {
  const last = AppState.lastLesson || { subId: "1-1", stage: 0 };
  selectSubUnit(last.subId, last.stage);
}

function reviewLastLesson() {
  const lastSubId = AppState.currentSubUnit || "1-1";
  
  if (AppState.wrongCount > 0) {
    showToast(`🤖 AI 분석: 지난 학습에서 ${AppState.wrongCount}번의 실수가 발견되었습니다. 집중 복습을 시작합니다.`);
  } else {
    showToast("🤖 AI 분석: 지난 학습 성취도가 높습니다! 심화 예문으로 복습을 진행합니다.");
  }
  
  setTimeout(() => {
    const reviewData = (typeof CURRICULUM_DATA !== 'undefined' && CURRICULUM_DATA[lastSubId]) 
                        ? CURRICULUM_DATA[lastSubId].find(s => s.level === '상') || CURRICULUM_DATA[lastSubId][0]
                        : null;

    if (reviewData) {
      AppState.curStage = 0;
      AppState.stageUnlocked = [true, false, false, false, false];
      injectStageData(reviewData);
      goScreen('learn');
      updateStageTabs();
      showToast("📝 실수 패턴을 반영한 맞춤형 복습 문장입니다.");
    }
  }, 1200);
}

function injectStageData(data) {
  const enEl = document.getElementById('xray-en');
  const koEl = document.getElementById('xray-ko');
  const titleEl = document.getElementById('learn-title-display');
  const gramTarget = document.getElementById('gram-target');
  const structureLabels = document.getElementById('structure-labels');

  // Highlight goal grammar in Stage 0
  let highlightedEn = data.en;
  if (data.highlight) {
    const reg = new RegExp(`(${data.highlight})`, 'gi');
    highlightedEn = data.en.replace(reg, '<span class="badge-pri" style="font-size:inherit; padding:2px 6px;">$1</span>');
  }

  if (enEl) enEl.innerHTML = highlightedEn;
  if (koEl) koEl.textContent = data.ko;
  if (titleEl) titleEl.textContent = findSubUnit(AppState.currentSubUnit).title.replace(/^[0-9.-]+\s*/, '');
  if (gramTarget) gramTarget.textContent = findSubUnit(AppState.currentSubUnit).grammar;

  // Render Structural Labels (S/V/O/C)
  if (structureLabels && data.analysis.labels) {
    structureLabels.innerHTML = data.analysis.labels.map(l => `<div class="badge-diff diff-low" style="background:#F2F4F7; color:#475467; border:1px solid #EAECF0;">${l}</div>`).join('<span style="color:#D0D5DD;">→</span>');
  }

  // Update Analysis Box
  const analysisPoint = document.getElementById('analysis-point');
  const analysisStructure = document.getElementById('analysis-structure');
  if (analysisPoint) analysisPoint.textContent = data.analysis.point;
  if (analysisStructure) analysisStructure.textContent = data.analysis.structure;

  // Store for other stages
  AppState.curUnitData = data;
}

function openDiagQuiz() {
  const modal = document.getElementById('diag-quiz-modal');
  const qText = document.getElementById('diag-q-text');
  const optionsContainer = document.getElementById('diag-options');
  if (!modal || !qText || !optionsContainer) return;
  
  const data = AppState.curUnitData;
  const blanked = data.en.replace(new RegExp(data.blank_word, 'i'), ' (_____) ');
  qText.innerHTML = `<span style="font-size:14px; color:#667085;">[문맥에 맞는 단어를 고르세요]</span><br><br>${blanked}`;
  
  // 3-Choice Generation
  const correct = data.blank_word;
  const distractors = ["which", "that", "it", "to", "for", "been"].filter(d => d.toLowerCase() !== correct.toLowerCase());
  const shuffled = [correct, distractors[0], distractors[1]].sort(() => Math.random() - 0.5);

  optionsContainer.innerHTML = '';
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn-sec';
    btn.style.width = '100%';
    btn.textContent = opt;
    btn.onclick = () => submitDiagQuiz(opt);
    optionsContainer.appendChild(btn);
  });
  
  modal.style.display = 'flex';
}

function submitDiagQuiz(ans) {
  const target = AppState.curUnitData.blank_word.toLowerCase();
  if (ans.toLowerCase() === target) {
    showToast("🎉 정답입니다! 진단평가 통과.");
    document.getElementById('diag-quiz-modal').style.display = 'none';
    AppState.stageUnlocked[1] = true;
    goStage(1);
  } else {
    showToast("❌ 오답입니다. 문법 구조를 다시 생각해보세요.");
  }
}

function updateStageTabs() {
  document.querySelectorAll('.stage-tab').forEach((tab, i) => {
    tab.className = 'stage-tab' + (i === AppState.curStage ? ' on' : '') + (AppState.stageUnlocked[i] ? '' : ' locked');
  });
  
  // Update visibility of stage panes with smooth class toggle
  document.querySelectorAll('.stage-pane').forEach((p, i) => {
    p.classList.remove('active-pane');
    p.style.display = 'none';
    if (i === AppState.curStage) {
      p.style.display = 'block';
      setTimeout(() => p.classList.add('active-pane'), 10);
    }
  });
}

function goStage(n) {
  if (!AppState.stageUnlocked[n]) return showToast("🔒 이전 단계를 먼저 완료하세요.");
  AppState.curStage = n;
  updateStageTabs();
  if (n === 1) initChopStage();
  if (n === 2) initRearStage();
  if (n === 3) initBlankStage();
  if (n === 4) initWriteStage();
}

function initChopStage() {
  const wrap = document.getElementById('chop-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const tokens = AppState.curUnitData.tokens;
  tokens.forEach((t, i) => {
    const span = document.createElement('span');
    span.className = 'chop-token';
    span.textContent = t;
    wrap.appendChild(span);
    if (i < tokens.length - 1) {
      const gap = document.createElement('span');
      gap.className = 'chop-gap';
      gap.onclick = () => gap.classList.toggle('cut');
      wrap.appendChild(gap);
    }
  });
}

function checkChop() {
  const cuts = document.querySelectorAll('.chop-gap.cut').length;
  if (cuts === 0) return showToast("문장을 성분별로 나누어보세요!");
  AppState.stageUnlocked[2] = true;
  showToast("✓ 자르기 완료! 2단계로 이동합니다.");
  goStage(2);
}

function initRearStage() {
  const bank = document.getElementById('rear-bank');
  const drop = document.getElementById('rear-drop');
  if (!bank || !drop) return;
  bank.innerHTML = ''; drop.innerHTML = '';
  
  const tokens = [...AppState.curUnitData.tokens].sort(() => Math.random() - 0.5);
  tokens.forEach(t => {
    const btn = document.createElement('div');
    btn.className = 'token-tile';
    btn.textContent = t;
    btn.onclick = () => {
      if (btn.parentElement === bank) drop.appendChild(btn);
      else bank.appendChild(btn);
    };
    bank.appendChild(btn);
  });
}

function checkRear() {
  const res = Array.from(document.querySelectorAll('#rear-drop .token-tile')).map(t => t.textContent).join(' ');
  const target = AppState.curUnitData.en.replace(/[.,]/g, '');
  if (res.toLowerCase() === target.toLowerCase()) {
    AppState.stageUnlocked[3] = true;
    AppState.lastLesson.stage = 3;
    showToast("✓ 정확한 어순입니다! 3단계 이동.");
    goStage(3);
  } else {
    AppState.wrongCount++;
    showToast("❌ 어순이 틀렸습니다. 다시 시도해보세요.");
  }
}

function initBlankStage() {
  const q = document.getElementById('blank-question');
  if (!q) return;
  const target = AppState.curUnitData.blank_word;
  q.innerHTML = AppState.curUnitData.en.replace(target, `<input type="text" id="blank-input" placeholder="이곳에 입력" style="border-bottom:2px solid var(--pri); width:120px;">`);
}

function checkBlank() {
  const input = document.getElementById('blank-input').value.trim();
  if (input.toLowerCase() === AppState.curUnitData.blank_word.toLowerCase()) {
    AppState.stageUnlocked[4] = true;
    showToast("✓ 핵심 어휘 완성! 마지막 4단계 이동.");
    goStage(4);
  } else {
    showToast("❌ 단어를 다시 확인해보세요.");
  }
}

function initWriteStage() {
  const ko = document.getElementById('write-ko-target');
  if (ko) ko.textContent = AppState.curUnitData.ko;
}

function showProgressiveHint() {
  const unitId = AppState.currentSubUnit;
  const stage = AppState.curStage;
  if (!AppState.studentHintsUsed[unitId]) AppState.studentHintsUsed[unitId] = 0;
  
  const hints = AppState.curUnitData.hints || ["힌트가 없습니다."];
  const count = AppState.studentHintsUsed[unitId];

  // Progressive Logic: Show hint based on current count (max 3)
  if (count < hints.length) {
    showToast(hints[count]);
    AppState.studentHintsUsed[unitId]++;
  } else {
    showToast("✅ 모든 힌트를 확인했습니다. 문장을 다시 분석해보세요!");
  }
}

function toggleBeamMode() {
  AppState.isBeamMode = !AppState.isBeamMode;
  document.body.classList.toggle('beam-mode', AppState.isBeamMode);
  
  const exitBtn = document.getElementById('beam-exit-btn');
  if (exitBtn) exitBtn.style.display = AppState.isBeamMode ? 'block' : 'none';

  if (!AppState.isBeamMode) {
    goScreen('dashboard'); // Return to Teacher Home on exit
  }
  
  showToast(AppState.isBeamMode ? "📽️ 빔 모드가 활성화되었습니다." : "📽️ 빔 모드 해제: 홈으로 이동합니다.");
}

/**
 * MODAL Logic: Click outside or Press X to close
 */
function setupClickOut() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    if (id === 'lesson-create-modal') renderLessonCreateUnits();
  }
}

function renderLessonCreateUnits() {
  const list = document.getElementById('lesson-unit-select');
  if (!list) return;
  list.innerHTML = '';
  GRAMMAR_UNITS.forEach(unit => {
    const div = document.createElement('div');
    div.style.marginBottom = '12px';
    div.innerHTML = `
      <label style="font-weight:700; display:block; margin-bottom:4px;">
        <input type="checkbox" data-unit="${unit.id}"> ${unit.title}
      </label>
      <div style="padding-left:20px; display:flex; flex-direction:column; gap:4px;">
        ${unit.subUnits.map(sub => `
          <label style="font-size:12px; color:#475467;">
            <input type="checkbox" data-sub="${sub.id}"> ${sub.title}
          </label>
        `).join('')}
      </div>
    `;
    list.appendChild(div);
  });
}

function createLessonFromSelected() {
  const selected = Array.from(document.querySelectorAll('#lesson-unit-select input:checked'));
  if (selected.length === 0) return showToast("단원을 선택해주세요.");
  showToast(`${selected.length}개의 단원으로 수업을 생성했습니다.`);
  document.getElementById('lesson-create-modal').style.display = 'none';
}

function startClock() {
  setInterval(() => {
    const now = new Date();
    const el = document.getElementById('util-clock');
    if (el) el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, 1000);
}

function showToast(msg) {
  const toast = document.getElementById('global-toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('on');
    setTimeout(() => toast.classList.remove('on'), 3000);
  }
}

document.addEventListener('DOMContentLoaded', init);
