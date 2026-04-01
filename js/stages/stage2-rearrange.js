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
