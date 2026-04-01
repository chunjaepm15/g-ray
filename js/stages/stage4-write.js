/**
 * STEP 4: DIRECT WRITE
 */

function renderWriteUI(s) {
  const ko = document.getElementById('write-ko');
  if (ko) ko.textContent = s.ko;
  const input = document.getElementById('write-input');
  if (input) {
    input.value = '';
    input.classList.remove('correct', 'wrong');
  }
}

function checkWrite() {
  const input = document.getElementById('write-input');
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  
  const cleanUser = input.value.trim().toLowerCase().replace(/[.,!?;]/g, '');
  const cleanCorrect = s.en.toLowerCase().replace(/[.,!?;]/g, '');

  if (cleanUser === cleanCorrect) {
    input.classList.remove('wrong');
    input.classList.add('correct');
    showToast("✓ 완벽한 문장입니다! 축하합니다.");
    setTimeout(unlockNextStage, 1000);
  } else {
    input.classList.add('wrong');
    showToast("✗ 오답입니다. 대소문자나 철자를 확인하세요.");
  }
}
