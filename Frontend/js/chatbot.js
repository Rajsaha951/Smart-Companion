// ===============================
// CHATBOT - AI Companion
// Separate Tab Integration
// ===============================

let chatHistory = [];
let isTyping = false;

// ========== SEND MESSAGE ==========
async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  // Disable input
  input.disabled = true;
  
  // Add user message
  addChatMessage(message, 'user');
  
  // Clear input
  input.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    // Get user profile and metrics
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    
    // Prepare stable profile
    const stableProfile = profile.stableProfile || {
      adhd_safe: true,
      dyslexia_safe: true,
      tone: 'reassuring',
      max_sentence_length: 8,
      needs_extra_breakdown: true,
      no_pressure_language: true
    };
    
    // Call API
    const response = await apiRequest('/companion/respond', 'POST', {
      message: message,
      stable_profile: stableProfile,
      metrics: metrics
    });
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Get AI response
    const aiMessage = response.response || response.reply || "I'm here with you.";
    
    // Add AI message
    addChatMessage(aiMessage, 'ai');
    
    // Save to history
    chatHistory.push({
      user: message,
      ai: aiMessage,
      timestamp: new Date().toISOString()
    });
    
    // Save to localStorage (keep last 50 messages)
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.slice(-50)));
    
  } catch (error) {
    console.error('Chatbot error:', error);
    
    removeTypingIndicator();
    
    // Fallback response
    const fallbacks = [
      "I'm here, even though something didn't work. Let's try again gently.",
      "That's okay - technology isn't perfect. I'm still here with you.",
      "Let's take a breath. We can try again when you're ready."
    ];
    
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    addChatMessage(fallback, 'ai');
    
  } finally {
    // Re-enable input
    input.disabled = false;
    input.focus();
  }
}

// ========== ADD MESSAGE TO CHAT ==========
function addChatMessage(text, type) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  
  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = type === 'user' ? '👤' : '🤗';
  
  // Bubble
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  
  // Split text into paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim());
  paragraphs.forEach(p => {
    const pEl = document.createElement('p');
    pEl.textContent = p;
    pEl.style.margin = paragraphs.length > 1 ? '0 0 8px 0' : '0';
    bubble.appendChild(pEl);
  });
  
  // Time
  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  // Assemble
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  messageDiv.appendChild(time);
  
  chatBox.appendChild(messageDiv);
  
  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Animate in
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(10px)';
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);
}

// ========== TYPING INDICATOR ==========
function showTypingIndicator() {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typingIndicator';
  typingDiv.className = 'message ai-message';
  typingDiv.innerHTML = `
    <div class="message-avatar">🤗</div>
    <div class="message-bubble">
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Add typing animation CSS if not present
  if (!document.getElementById('typing-animation-style')) {
    const style = document.createElement('style');
    style.id = 'typing-animation-style';
    style.textContent = `
      .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
      }
      .typing-dot {
        width: 8px;
        height: 8px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.4;
        animation: typing-bounce 1.4s infinite;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes typing-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
  }
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

// ========== QUICK PROMPTS ==========
function sendQuickPrompt(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

// ========== CHAT INPUT KEYPRESS ==========
function handleChatKeypress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// ========== CLEAR CHAT ==========
function clearChat() {
  if (confirm('Clear all chat messages?')) {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
      chatBox.innerHTML = `
        <div class="message ai-message">
          <div class="message-avatar">🤗</div>
          <div class="message-bubble">
            <p style="margin: 0 0 8px 0;">Hi there. I'm here to listen without judgment.</p>
            <p style="margin: 0;">What's on your mind today?</p>
          </div>
          <div class="message-time">Just now</div>
        </div>
      `;
    }
    
    chatHistory = [];
    localStorage.removeItem('chatHistory');
  }
}

// ========== EXPORT CHAT ==========
function exportChat() {
  if (chatHistory.length === 0) {
    alert('No chat history to export');
    return;
  }
  
  let exportText = '# Smart Companion Chat History\n\n';
  exportText += `Exported: ${new Date().toLocaleString()}\n\n`;
  exportText += '---\n\n';
  
  chatHistory.forEach((msg) => {
    const time = new Date(msg.timestamp).toLocaleTimeString();
    exportText += `[${time}] You: ${msg.user}\n\n`;
    exportText += `[${time}] Companion: ${msg.ai}\n\n`;
    exportText += '---\n\n';
  });
  
  // Create download
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-companion-chat-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========== VOICE CHAT ==========
function startVoiceChat() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Voice input isn't available in your browser.");
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  
  const input = document.getElementById('chatInput');
  const btn = document.querySelector('.voice-chat-btn');
  
  recognition.onstart = () => {
    if (btn) {
      btn.classList.add('active');
    }
    if (input) {
      input.placeholder = 'Listening...';
    }
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (input) {
      input.value = transcript;
      input.placeholder = 'Share whats on your mind…';
    }
  };
  
  recognition.onerror = (error) => {
    console.error('Speech recognition error:', error);
    if (btn) {
      btn.classList.remove('active');
    }
    if (input) {
      input.placeholder = 'Share whats on your mind…';
    }
  };
  
  recognition.onend = () => {
    if (btn) {
      btn.classList.remove('active');
    }
    if (input) {
      input.placeholder = 'Share whats on your mind…';
    }
  };
  
  recognition.start();
}

// ========== LOAD CHAT HISTORY ==========
function loadChatHistory() {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    chatHistory = JSON.parse(saved);
    
    // Display messages if chatbox exists
    const chatBox = document.getElementById('chatBox');
    if (chatBox && chatHistory.length > 0) {
      // Clear default welcome message
      chatBox.innerHTML = '';
      
      // Show last 10 messages
      chatHistory.slice(-10).forEach(msg => {
        addChatMessage(msg.user, 'user');
        addChatMessage(msg.ai, 'ai');
      });
    }
  }
}

// ========== AUTO-RESIZE TEXTAREA ==========
function setupChatInputResize() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  setupChatInputResize();
  
  // Load history if on chatbot tab
  const chatTab = document.getElementById('chatbot-tab');
  if (chatTab && chatTab.classList.contains('active')) {
    loadChatHistory();
  }
});