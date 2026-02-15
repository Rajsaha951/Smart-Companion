// Authentication System

// Check Authentication on Page Load
async function checkAuth() {
  // Skip auth check on login page
  if (window.location.pathname.includes('login.html')) {
    return;
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await apiRequest('/auth/me', 'GET');
    if (response.success) {
      return response.user;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// Login Function
async function handleLogin(email, password) {
  try {
    showLoading();
    const response = await apiRequest('/auth/login', 'POST', { email, password });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    } else {
      showToast('Login failed', 'error');
    }
  } catch (error) {
    showToast(error.message || 'Login failed', 'error');
  } finally {
    hideLoading();
  }
}

// Logout Function
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('metrics');
    localStorage.removeItem('chatHistory');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  }
}

// Initialize auth check on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html')) {
      checkAuth();
    }
  });
}