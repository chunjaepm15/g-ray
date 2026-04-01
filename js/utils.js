/**
 * SHARED UTILITIES
 */

/**
 * Fish-Yates Shuffle
 */
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Toast Notifications (Mock-up)
 * Assumes a 'global-toast' element exists in HTML
 */
function showToast(msg) {
  const toast = document.getElementById('global-toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('on');
    setTimeout(() => toast.classList.remove('on'), 3000);
  } else {
    console.log("Toast:", msg);
  }
}
