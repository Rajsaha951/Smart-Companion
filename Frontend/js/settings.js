// Settings Management
function loadSettings() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const dyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
  const largeText = localStorage.getItem('largeText') === 'true';
  const highContrast = localStorage.getItem('highContrast') === 'true';
  
  if (darkMode) document.body.classList.add('dark');
  if (dyslexicFont) document.body.classList.add('dyslexic-font');
  if (largeText) document.body.classList.add('large-text');
  if (highContrast) document.body.classList.add('high-contrast');
}

function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function toggleFont() {
  document.body.classList.toggle('dyslexic-font');
  localStorage.setItem('dyslexicFont', document.body.classList.contains('dyslexic-font'));
}

function toggleFontSize() {
  document.body.classList.toggle('large-text');
  localStorage.setItem('largeText', document.body.classList.contains('large-text'));
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
}

document.addEventListener('DOMContentLoaded', loadSettings);