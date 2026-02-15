// Main Application Logic

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  console.log('Smart Companion app initializing...');
  initializeApp();
});

function initializeApp() {
  updateClock();
  setInterval(updateClock, 1000);
  
  loadUserStats();
  
  // Load settings if function exists
  if (typeof loadSettings === 'function') {
    loadSettings();
  }
  
  setupEventListeners();
  
  // Load chat history if on chatbot tab
  setTimeout(() => {
    const chatTab = document.getElementById('chatbot-tab');
    if (chatTab && chatTab.classList.contains('active')) {
      if (typeof loadChatHistory === 'function') {
        loadChatHistory();
      }
    }
  }, 100);
  
  console.log('Smart Companion app initialized successfully');
}

// Clock Update
function updateClock() {
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay) {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}

// Load User Stats
function loadUserStats() {
  const wins = parseInt(localStorage.getItem('microWins') || '0');
  const streak = parseInt(localStorage.getItem('dayStreak') || '0');
  
  const todayWins = document.getElementById('todayWins');
  const totalWins = document.getElementById('totalMicroWins');
  const streakCount = document.getElementById('streakCount');
  
  if (todayWins) todayWins.textContent = 0;
  if (totalWins) totalWins.textContent = wins;
  if (streakCount) streakCount.textContent = streak;
}

// Tab Switching
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Hide all tabs
  document.querySelectorAll('.content-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Activate selected button
  const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
    selectedBtn.setAttribute('aria-selected', 'true');
  }
  
  // Load chat history when switching to chatbot
  if (tabName === 'chatbot') {
    setTimeout(() => {
      if (typeof loadChatHistory === 'function') {
        loadChatHistory();
      }
    }, 100);
  }
}

// Energy Level Setting
function setEnergy(level) {
  // Remove active from all dots
  document.querySelectorAll('.energy-dots .dot').forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Add active to selected dot
  const selectedDot = document.querySelector(`.energy-dots .dot[data-level="${level}"]`);
  if (selectedDot) {
    selectedDot.classList.add('active');
  }
  
  // Update label
  const labels = ['Very Low', 'Low', 'Balanced', 'Good', 'Great'];
  const label = document.getElementById('energyLabel');
  if (label && labels[level - 1]) {
    label.textContent = labels[level - 1];
  }
  
  // Save to metrics
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  metrics.energy = labels[level - 1] || 'Balanced';
  localStorage.setItem('metrics', JSON.stringify(metrics));
}

// Show Stats Modal
function showStats() {
  const modal = document.getElementById('statsModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Update values
    const wins = localStorage.getItem('microWins') || '0';
    const streak = localStorage.getItem('dayStreak') || '0';
    
    const modalWins = document.getElementById('modalTotalWins');
    const modalStreak = document.getElementById('modalStreak');
    const modalTasks = document.getElementById('modalTasks');
    
    if (modalWins) modalWins.textContent = wins;
    if (modalStreak) modalStreak.textContent = streak;
    if (modalTasks) modalTasks.textContent = Math.floor(parseInt(wins) / 3);
  }
}

function closeStats() {
  const modal = document.getElementById('statsModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Calm Space Modal
function enterCalmSpace() {
  const modal = document.getElementById('calmSpaceModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    startBreathingExercise();
  }
}

function closeCalmSpace() {
  const modal = document.getElementById('calmSpaceModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

let breathingInterval = null;

function startBreathingExercise() {
  const instruction = document.getElementById('breathInstruction');
  if (!instruction) return;
  
  // Clear any existing interval
  if (breathingInterval) {
    clearInterval(breathingInterval);
  }
  
  let phase = 0;
  const phases = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
  
  // Set initial phase
  instruction.textContent = phases[phase];
  
  breathingInterval = setInterval(() => {
    phase = (phase + 1) % 4;
    if (instruction) {
      instruction.textContent = phases[phase];
    }
    
    // Stop if modal closed
    const modal = document.getElementById('calmSpaceModal');
    if (!modal || !modal.classList.contains('active')) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
  }, 3000);
}

// FAB Menu
function toggleFabMenu() {
  const menu = document.getElementById('fabMenu');
  const mainFab = document.querySelector('.main-fab');
  
  if (menu && mainFab) {
    menu.classList.toggle('active');
    mainFab.classList.toggle('active');
  }
}

// Emergency Calm Down
function emergencyCalmDown() {
  toggleFabMenu();
  setTimeout(() => {
    enterCalmSpace();
  }, 100);
}

// Quick Timer
let quickTimerInterval = null;

function quickTimer() {
  toggleFabMenu();
  
  if (quickTimerInterval) {
    clearInterval(quickTimerInterval);
    quickTimerInterval = null;
    showToast('Timer cancelled', 'info');
    return;
  }
  
  showToast('Timer starting... Focus for 5 minutes!', 'info');
  
  let totalSeconds = 5 * 60; // 5 minutes
  
  quickTimerInterval = setInterval(() => {
    totalSeconds--;
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (totalSeconds <= 0) {
      clearInterval(quickTimerInterval);
      quickTimerInterval = null;
      showToast('Timer complete! Great work! 🎉', 'success');
    }
  }, 1000);
}

// Body Doubling
let bodyDoublingInterval = null;

function startBodyDoubling() {
  toggleFabMenu();
  
  const modal = document.getElementById('bodyDoublingModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    let seconds = 0;
    bodyDoublingInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      
      const display = document.getElementById('sessionTime');
      if (display) {
        display.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
      }
      
      // Update message periodically
      if (seconds % 120 === 0) {
        const messages = [
          'You\'re doing great.',
          'Keep going.',
          'I\'m right here with you.',
          'You\'ve got this.'
        ];
        const messageEl = document.getElementById('companionMessage');
        if (messageEl) {
          messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
      }
    }, 1000);
  }
}

function endBodyDoubling() {
  if (bodyDoublingInterval) {
    clearInterval(bodyDoublingInterval);
    bodyDoublingInterval = null;
  }
  
  const modal = document.getElementById('bodyDoublingModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  
  showToast('Session complete! Well done! 💪', 'success');
}

// Voice Input for Task
function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Voice input not available in this browser', 'warning');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  
  const input = document.getElementById('taskInput');
  
  recognition.onstart = () => {
    showToast('Listening...', 'info');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (input) {
      input.value = transcript;
    }
    showToast('Got it!', 'success');
  };
  
  recognition.onerror = (error) => {
    console.error('Speech recognition error:', error);
    showToast('Could not understand. Please try again.', 'error');
  };
  
  recognition.start();
}

// Setup Event Listeners
function setupEventListeners() {
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        const modal = overlay.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
        }
      }
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.activeElement && document.activeElement.id === 'taskInput') {
        breakDownTask();
      } else if (document.activeElement && document.activeElement.id === 'chatInput') {
        if (typeof sendMessage === 'function') {
          sendMessage();
        }
      }
    }
  });
  
  // Auto-resize chat input
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
  }
}