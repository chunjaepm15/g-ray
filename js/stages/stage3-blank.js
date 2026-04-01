/**
 * STEP 3: BLANK (Fill in the Blank)
 */

function renderBlankUI(s) {
  const q = document.getElementById('blank-sent');
  if (q) q.innerHTML = s.steps.blank.sent;
  const input = document.getElementById('blank-input');
  if (input) {
    input.value = '';
    input.placeholder = "내용을 입력하세요...";
    input.classList.remove('correct', 'wrong');
  }
}

function checkBlank() {
  const input = document.getElementById('blank-input');
  const sentences = getEnhancedSentences(AppState.currentUnit);
  const s = sentences[AppState.currentSentIdx];
  
  if (input.value.trim().toLowerCase() === s.steps.blank.ans.toLowerCase()) {
    input.classList.remove('wrong');
    input.classList.add('correct');
    showToast("✓ 정답입니다!");
    setTimeout(unlockNextStage, 1000);
  } else {
    input.classList.add('wrong');
    showToast("✗ 다시 생각해보세요.");
  }
}
