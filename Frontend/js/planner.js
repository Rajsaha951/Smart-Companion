// Task Planner Module

let currentSession = null;
let currentSteps = [];
let completedSteps = 0;

// Break Down Task
async function breakDownTask() {
  const input = document.getElementById('taskInput');
  if (!input) {
    console.error('Task input not found');
    return;
  }
  
  const taskText = input.value.trim();
  
  if (!taskText) {
    showToast('Please enter a task first', 'warning');
    input.focus();
    return;
  }
  
  try {
    showLoading();
    
    // Get user preferences (or use defaults)
    const savedProfile = localStorage.getItem('profile');
    const preferences = (savedProfile ? JSON.parse(savedProfile).preferences : null) || {
      reading_difficulty: 'medium',
      prefers_micro_steps: true,
      time_blindness: true,
      prefers_minimal_text: true,
      auto_adjust_allowed: true
    };
    
    // Get metrics (or use defaults)
    const savedMetrics = localStorage.getItem('metrics');
    const metrics = (savedMetrics ? JSON.parse(savedMetrics) : null) || {
      avg_time_to_first_action_seconds: 0,
      avg_step_completion_time_seconds: 0,
      steps_completed_last_session: 0,
      steps_shown_last_session: 0,
      session_abandon_rate: 0
    };
    
    const response = await apiRequest('/planner/decompose', 'POST', {
      task: taskText,
      preferences,
      metrics
    });
    
    if (response.success && response.steps && response.steps.length > 0) {
      currentSession = response.sessionId;
      currentSteps = response.steps;
      completedSteps = 0;
      
      displaySteps(response.steps);
      updateFocusMode();
      showToast('Task broken down successfully!', 'success');
      
      // Update stats
      updateStats();
    } else {
      throw new Error('No steps returned from API');
    }
  } catch (error) {
    console.error('Breakdown error:', error);
    showToast('Using simple breakdown', 'warning');
    
    // Fallback: Create simple steps
    const simpleSteps = [
      `Start: ${taskText}`,
      'Take the first small action',
      'Continue to the next step',
      'Review your progress'
    ];
    
    currentSteps = simpleSteps;
    completedSteps = 0;
    displaySteps(simpleSteps);
    updateFocusMode();
  } finally {
    hideLoading();
  }
}

// Display Steps in UI
function displaySteps(steps) {
  const responseArea = document.getElementById('plannerResponse');
  if (!responseArea) {
    console.error('Planner response area not found');
    return;
  }
  
  responseArea.classList.add('active');
  responseArea.innerHTML = `
    <h3 style="margin-bottom: 16px; color: var(--ink);">Your Micro-Steps:</h3>
    <ul class="steps-list" id="stepsList">
      ${steps.map((step, index) => `
        <li class="step-item" data-step="${index}">
          <div class="step-checkbox" onclick="toggleStep(${index})"></div>
          <span class="step-text">${step}</span>
        </li>
      `).join('')}
    </ul>
    <div style="margin-top: 24px; text-align: center;">
      <button class="modal-btn" onclick="switchTab('focus')">
        Start Focus Mode
      </button>
    </div>
  `;
}

// Toggle Step Completion
function toggleStep(index) {
  const stepItem = document.querySelector(`.step-item[data-step="${index}"]`);
  if (!stepItem) return;
  
  const checkbox = stepItem.querySelector('.step-checkbox');
  
  if (stepItem.classList.contains('completed')) {
    stepItem.classList.remove('completed');
    checkbox.classList.remove('checked');
    completedSteps--;
  } else {
    stepItem.classList.add('completed');
    checkbox.classList.add('checked');
    completedSteps++;
    
    // Update progress on backend
    updateProgress();
    
    // Celebrate!
    showToast('Great job! 🎉', 'success');
  }
  
  updateStats();
  updateFocusMode();
}

// Update Progress on Backend
async function updateProgress() {
  if (!currentSession) return;
  
  try {
    await apiRequest(`/planner/sessions/${currentSession}`, 'PUT', {
      currentStepIndex: completedSteps,
      completed: completedSteps >= currentSteps.length
    });
  } catch (error) {
    console.error('Failed to update progress:', error);
    // Don't show error to user, just log it
  }
}

// Update Stats Display
function updateStats() {
  const todayWins = document.getElementById('todayWins');
  const totalWins = document.getElementById('totalMicroWins');
  const modalWins = document.getElementById('modalTotalWins');
  
  const savedWins = parseInt(localStorage.getItem('microWins') || '0');
  
  if (todayWins) todayWins.textContent = completedSteps;
  if (totalWins) totalWins.textContent = savedWins + completedSteps;
  if (modalWins) modalWins.textContent = savedWins + completedSteps;
  
  // Save total wins
  localStorage.setItem('microWins', savedWins + 1);
}

// Update Focus Mode
function updateFocusMode() {
  const focusStepNumber = document.getElementById('focusStepNumber');
  const focusStepText = document.getElementById('focusStepText');
  const focusProgressFill = document.getElementById('focusProgressFill');
  const focusProgressText = document.getElementById('focusProgressText');
  const skipBtn = document.getElementById('skipStepBtn');
  const completeBtn = document.getElementById('completeStepBtn');
  
  if (!currentSteps || currentSteps.length === 0) {
    if (focusStepNumber) focusStepNumber.textContent = 'No active task';
    if (focusStepText) focusStepText.textContent = 'Break down a task in the Task Planner to begin';
    if (skipBtn) skipBtn.disabled = true;
    if (completeBtn) completeBtn.disabled = true;
    if (focusProgressFill) focusProgressFill.style.width = '0%';
    if (focusProgressText) focusProgressText.textContent = 'No task in progress';
    return;
  }
  
  const currentStepIndex = completedSteps < currentSteps.length ? completedSteps : currentSteps.length - 1;
  const progress = (completedSteps / currentSteps.length) * 100;
  
  if (focusStepNumber) focusStepNumber.textContent = `Step ${currentStepIndex + 1} of ${currentSteps.length}`;
  if (focusStepText) focusStepText.textContent = currentSteps[currentStepIndex];
  if (focusProgressFill) focusProgressFill.style.width = `${progress}%`;
  if (focusProgressText) focusProgressText.textContent = `${completedSteps} of ${currentSteps.length} steps completed`;
  if (skipBtn) skipBtn.disabled = false;
  if (completeBtn) completeBtn.disabled = completedSteps >= currentSteps.length;
  
  // If all steps completed
  if (completedSteps >= currentSteps.length) {
    showToast('🎉 All steps completed! Amazing work!', 'success');
  }
}

// Complete Step from Focus Mode
function completeStep() {
  if (completedSteps < currentSteps.length) {
    toggleStep(completedSteps);
  }
}

// Skip Step
function skipStep() {
  if (completedSteps < currentSteps.length - 1) {
    completedSteps++;
    updateFocusMode();
    showToast('Step skipped', 'info');
  }
}

// Fill Template
function fillTemplate(text) {
  const input = document.getElementById('taskInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

// Detect Paralysis (typing pause)
let typingTimer;
function detectParalysis() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    const input = document.getElementById('taskInput');
    if (input && input.value.length > 20 && input.value.length < 30) {
      // Optional: Show gentle encouragement after pause
      // showToast('Take your time. We\'re here when you\'re ready. 💙', 'info');
    }
  }, 3000);
}

// Show Timer Estimate
function showTimerEstimate() {
  if (currentSteps && currentSteps.length > 0) {
    const estimate = currentSteps.length * 2; // 2 minutes per step
    showToast(`Estimated time: ${estimate} minutes`, 'info');
  } else {
    showToast('Break down a task first to see time estimate', 'warning');
  }
}

// Show Examples
function showExamples() {
  showToast('Feature coming soon! Check back later.', 'info');
}

// Pause and Reflect
function pauseAndReflect() {
  showToast('It\'s okay to pause. Take all the time you need. 💙', 'info');
}