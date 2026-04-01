/**
 * GRAMMAR VIEWER UI HANDLERS (v12)
 * Core UI shell logic. 
 * Specific stage logic has been moved to js/stages/*.js for better collaboration.
 */

/**
 * Sidebar UNIT list
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

/**
 * UNIT sentences list
 */
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
 * WRONG ANSWER list
 */
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
