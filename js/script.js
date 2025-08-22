// Authentication form popup functionality
let currentOpenPopup = null;

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
}

function closeLoginForm() {
    const popup = document.getElementById('loginFormPopup');
    popup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
    
    // Clear form and error message
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginErrorMessage').textContent = '';
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
    document.getElementById('registerErrorMessage').textContent = '';
}

function closeAllPopups() {
    const loginPopup = document.getElementById('loginFormPopup');
    const registerPopup = document.getElementById('registerFormPopup');
    
    loginPopup.classList.remove('show');
    registerPopup.classList.remove('show');
    currentOpenPopup = null;
    document.removeEventListener('click', handleOutsideClick);
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
    errorElement.textContent = '';
    
    if (!username || !password) {
        errorElement.textContent = 'Please fill in all fields';
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            if (errorElement.textContent === 'Please fill in all fields') {
                errorElement.textContent = '';
            }
        }, 5000);
        return;
    }
    
    // Here you would typically make an API call to your backend
    console.log('Login attempt:', { username, password });
    
    // For demo purposes, show success message
    errorElement.textContent = 'Login functionality would be implemented here';
    errorElement.style.color = '#059669';
    errorElement.style.backgroundColor = 'rgba(5, 150, 105, 0.1)';
    errorElement.style.borderColor = 'rgba(5, 150, 105, 0.2)';
    
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
    errorElement.textContent = '';
    
    if (!username || !email || !password || !confirmPassword) {
        errorElement.textContent = 'Please fill in all fields';
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            if (errorElement.textContent === 'Please fill in all fields') {
                errorElement.textContent = '';
            }
        }, 5000);
        return;
    }
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            if (errorElement.textContent === 'Passwords do not match') {
                errorElement.textContent = '';
            }
        }, 5000);
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters long';
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            if (errorElement.textContent === 'Password must be at least 6 characters long') {
                errorElement.textContent = '';
            }
        }, 5000);
        return;
    }
    
    // Here you would typically make an API call to your backend
    console.log('Register attempt:', { username, email, password });
    
    // For demo purposes, show success message
    errorElement.textContent = 'Registration functionality would be implemented here';
    errorElement.style.color = '#059669';
    errorElement.style.backgroundColor = 'rgba(5, 150, 105, 0.1)';
    errorElement.style.borderColor = 'rgba(5, 150, 105, 0.2)';
    
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
            if (errorElement.textContent && !errorElement.textContent.includes('functionality would be implemented')) {
                errorElement.textContent = '';
            }
        });
    }
}
