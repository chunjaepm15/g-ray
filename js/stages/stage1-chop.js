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
  const cuts = document.querySelectorAll('.chop-gap.cut').length;
  if (cuts > 0) {
    document.getElementById('chop-next-btn')?.classList.remove('locked');
  } else {
    document.getElementById('chop-next-btn')?.classList.add('locked');
  }
}
