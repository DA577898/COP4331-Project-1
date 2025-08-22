// Authentication form popup functionality
let currentOpenPopup = null;
const messageTimers = {}; // Store auto-hide timers per message element

function clearMessage(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('success');
    if (messageTimers[elementId]) {
        clearTimeout(messageTimers[elementId]);
        delete messageTimers[elementId];
    }
}

function showMessage(elementId, text, type = 'error', autoHideMs = 5000) {
    const el = document.getElementById(elementId);
    if (!el) return;
    // Reset styles
    el.classList.remove('success');
    if (type === 'success') {
        el.classList.add('success');
    }
    el.textContent = text;
    // Reset any prior timer
    if (messageTimers[elementId]) {
        clearTimeout(messageTimers[elementId]);
    }
    if (autoHideMs > 0) {
        messageTimers[elementId] = setTimeout(() => {
            // Only clear if the same text is still present
            if (el.textContent === text) {
                clearMessage(elementId);
            }
        }, autoHideMs);
    }
}

function showLoginForm() {
    // Close any other open popup
    closeAllPopups();
    
    const popup = document.getElementById('loginFormPopup');
    popup.classList.add('show');
    currentOpenPopup = popup;
    
    // Focus on first input for better UX
    setTimeout(() => {
        document.getElementById('loginUsername').focus();
    }, 100);
    
    // Close popup when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Add blur event listeners for auto-hide error messages
    setupErrorAutoHide('loginUsername', 'loginErrorMessage');
    setupErrorAutoHide('loginPassword', 'loginErrorMessage');
    // Clear any prior message & success state when opening
    clearMessage('loginErrorMessage');
    // Clear message as user types
    setupInputClear('loginUsername', 'loginErrorMessage');
    setupInputClear('loginPassword', 'loginErrorMessage');
}

function showRegisterForm() {
    // Close any other open popup
    closeAllPopups();
    
    const popup = document.getElementById('registerFormPopup');
    popup.classList.add('show');
    currentOpenPopup = popup;
    
    // Focus on first input for better UX
    setTimeout(() => {
        document.getElementById('registerUsername').focus();
    }, 100);
    
    // Close popup when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Add blur event listeners for auto-hide error messages
    setupErrorAutoHide('registerUsername', 'registerErrorMessage');
    setupErrorAutoHide('registerEmail', 'registerErrorMessage');
    setupErrorAutoHide('registerPassword', 'registerErrorMessage');
    setupErrorAutoHide('confirmPassword', 'registerErrorMessage');
    // Clear any prior message & success state when opening
    clearMessage('registerErrorMessage');
    // Clear message as user types
    setupInputClear('registerUsername', 'registerErrorMessage');
    setupInputClear('registerEmail', 'registerErrorMessage');
    setupInputClear('registerPassword', 'registerErrorMessage');
    setupInputClear('confirmPassword', 'registerErrorMessage');
}

function closeLoginForm() {
    const popup = document.getElementById('loginFormPopup');
    popup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
    
    // Clear form and error message
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    clearMessage('loginErrorMessage');
}

function closeRegisterForm() {
    const popup = document.getElementById('registerFormPopup');
    popup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
    
    // Clear form and error message
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    clearMessage('registerErrorMessage');
}

function closeAllPopups() {
    const loginPopup = document.getElementById('loginFormPopup');
    const registerPopup = document.getElementById('registerFormPopup');
    
    loginPopup.classList.remove('show');
    registerPopup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
    // Also clear any lingering messages
    clearMessage('loginErrorMessage');
    clearMessage('registerErrorMessage');
}

function handleOutsideClick(event) {
    const navActions = document.querySelector('.nav-actions');
    
    if (!navActions.contains(event.target)) {
        closeAllPopups();
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginErrorMessage');
    
    // Clear previous error
    clearMessage('loginErrorMessage');
    
    if (!username || !password) {
        showMessage('loginErrorMessage', 'Please fill in all fields', 'error', 5000);
        return;
    }
    
    // Here you would typically make an API call to your backend
    console.log('Login attempt:', { username, password });
    
    // For demo purposes, show success message
    showMessage('loginErrorMessage', 'Login functionality would be implemented here', 'success', 2000);
    
    // Clear form and close popup after a delay
    setTimeout(() => {
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        closeLoginForm();
    }, 2000);
}

function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('registerErrorMessage');
    
    // Clear previous error
    clearMessage('registerErrorMessage');
    
    if (!username || !email || !password || !confirmPassword) {
        showMessage('registerErrorMessage', 'Please fill in all fields', 'error', 5000);
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('registerErrorMessage', 'Passwords do not match', 'error', 5000);
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerErrorMessage', 'Password must be at least 6 characters long', 'error', 5000);
        return;
    }
    
    // Here you would typically make an API call to your backend
    console.log('Register attempt:', { username, email, password });
    
    // For demo purposes, show success message
    showMessage('registerErrorMessage', 'Registration functionality would be implemented here', 'success', 2000);
    
    // Clear form and close popup after a delay
    setTimeout(() => {
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        closeRegisterForm();
    }, 2000);
}

// Close popup when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && currentOpenPopup) {
        closeAllPopups();
    }
});

// Function to setup auto-hide error messages on blur (tab out)
function setupErrorAutoHide(inputId, errorMessageId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorMessageId);
    
    if (input && errorElement) {
        input.addEventListener('blur', function() {
            // Hide error message when user tabs out of input field
            if (errorElement.textContent) {
                clearMessage(errorMessageId);
            }
        });
    }
}

function setupInputClear(inputId, errorMessageId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function() {
            clearMessage(errorMessageId);
        });
    }
}
