let currentOpenPopup = null;
const messageTimers = {};

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
    el.classList.remove('success');
    if (type === 'success') {
        el.classList.add('success');
    }
    el.textContent = text;
    if (messageTimers[elementId]) {
        clearTimeout(messageTimers[elementId]);
    }
    if (autoHideMs > 0) {
        messageTimers[elementId] = setTimeout(() => {
            if (el.textContent === text) {
                clearMessage(elementId);
            }
        }, autoHideMs);
    }
}

function showLoginForm() {
    closeAllPopups();
    
    const popup = document.getElementById('loginFormPopup');
    popup.classList.add('show');
    currentOpenPopup = popup;
    
    setTimeout(() => {
        document.getElementById('loginUsername').focus();
    }, 100);

    document.addEventListener('click', handleOutsideClick);
    
    setupErrorAutoHide('loginUsername', 'loginErrorMessage');
    setupErrorAutoHide('loginPassword', 'loginErrorMessage');
    clearMessage('loginErrorMessage');
    setupInputClear('loginUsername', 'loginErrorMessage');
    setupInputClear('loginPassword', 'loginErrorMessage');
}

function showRegisterForm() {
    closeAllPopups();
    
    const popup = document.getElementById('registerFormPopup');
    popup.classList.add('show');
    currentOpenPopup = popup;
    
    setTimeout(() => {
        document.getElementById('registerUsername').focus();
    }, 100);
    
    document.addEventListener('click', handleOutsideClick);
    
    setupErrorAutoHide('registerUsername', 'registerErrorMessage');
    setupErrorAutoHide('registerEmail', 'registerErrorMessage');
    setupErrorAutoHide('registerPassword', 'registerErrorMessage');
    setupErrorAutoHide('confirmPassword', 'registerErrorMessage');
    clearMessage('registerErrorMessage');
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
    
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    clearMessage('loginErrorMessage');
}

function closeRegisterForm() {
    const popup = document.getElementById('registerFormPopup');
    popup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
    
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
    
    clearMessage('loginErrorMessage');
    
    if (!username || !password) {
        showMessage('loginErrorMessage', 'Please fill in all fields', 'error', 5000);
        return;
    }
    
    console.log('Login attempt:', { username, password });
    
    showMessage('loginErrorMessage', 'Login functionality would be implemented here', 'success', 2000);
    
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
    
    console.log('Register attempt:', { username, email, password });
    
    showMessage('registerErrorMessage', 'Registration functionality would be implemented here', 'success', 2000);
    
    setTimeout(() => {
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        closeRegisterForm();
    }, 2000);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && currentOpenPopup) {
        closeAllPopups();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const appContainer = document.querySelector('.app-container');
    const btn = document.getElementById('mobileMenuButton');
    if (!btn || !appContainer) return;
    btn.addEventListener('click', function() {
        const isOpen = appContainer.classList.toggle('mobile-menu-open');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        if (!isOpen) {
            closeAllPopups();
        }
    });
});

function setupErrorAutoHide(inputId, errorMessageId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(errorMessageId);
    
    if (input && errorElement) {
        input.addEventListener('blur', function() {
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
