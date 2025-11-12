class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
            this.updateUIForLoggedInUser();
        }
    }

    signUp(userData) {
        const { name, email, password, confirmPassword } = userData;

        const validation = this.validateSignUp(name, email, password, confirmPassword);
        if (!validation.isValid) {
            return { success: false, message: validation.message };
        }

        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User with this email already exists!' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            watchlist: [],
            ratings: {}
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return { success: true, message: 'Account created successfully!' };
    }

    logIn(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'User not found!' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Incorrect password!' };
        }

        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        localStorage.setItem('currentUser', JSON.stringify(userSession));
        this.currentUser = userSession;

        return { success: true, message: 'Logged in successfully!' };
    }

    logOut() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUIForLoggedOutUser();
        window.location.href = './index.html';
    }

    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    validateSignUp(name, email, password, confirmPassword) {
        if (!name || name.trim().length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters long!' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address!' };
        }

        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long!' };
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return { 
                isValid: false, 
                message: 'Password must contain uppercase, lowercase, and number!' 
            };
        }

        if (password !== confirmPassword) {
            return { isValid: false, message: 'Passwords do not match!' };
        }

        return { isValid: true };
    }

    isLoggedIn() {
    if (this.currentUser !== null) {
        return true;
    }
    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        return true;
    }
    
    return false;
}

    updateUIForLoggedInUser() {
        const profileButton = document.getElementById('profile-button');
        if (profileButton && this.currentUser) {
            this.updateSidebarUserInfo();
        }
    }

    updateSidebarUserInfo() {
        if (!this.currentUser) return;

        const usernameElement = document.querySelector('.sidebar-item-value');
        const emailElement = document.querySelectorAll('.sidebar-item-value')[1];
        const memberSinceElement = document.querySelectorAll('.sidebar-item-value')[2];

        if (usernameElement) {
            usernameElement.textContent = this.currentUser.name;
        }
        if (emailElement) {
            emailElement.textContent = this.currentUser.email;
        }
        if (memberSinceElement) {
            const date = new Date(this.currentUser.createdAt);
            memberSinceElement.textContent = date.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }

        this.addLogoutButton();
    }

    addLogoutButton() {
        const sidebarContent = document.querySelector('.sidebar-content');
        let logoutSection = document.getElementById('logout-section');

        if (!logoutSection) {
            logoutSection = document.createElement('div');
            logoutSection.id = 'logout-section';
            logoutSection.className = 'sidebar-section';
            logoutSection.innerHTML = `
                <button id="logout-button" class="logout-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log Out</span>
                </button>
            `;
            sidebarContent.appendChild(logoutSection);

            document.getElementById('logout-button').addEventListener('click', () => {
                if (confirm('Are you sure you want to log out?')) {
                    this.logOut();
                }
            });
        }
    }

    updateUIForLoggedOutUser() {
        const logoutSection = document.getElementById('logout-section');
        if (logoutSection) {
            logoutSection.remove();
        }
    }
}

const authSystem = new AuthSystem();


document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('.registration__form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value || 'User';
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm').value;

            document.querySelectorAll('.error').forEach(err => err.classList.remove('show'));

            const result = authSystem.signUp({ name, email, password, confirmPassword });

            if (result.success) {
                showNotification(result.message, 'success');
                registrationForm.reset();
                
                setTimeout(() => {
                    const loginResult = authSystem.logIn(email, password);
                    if (loginResult.success) {
                        showNotification('Logged in automatically!', 'success');
                        authSystem.updateUIForLoggedInUser();
                    }
                }, 1000);
            } else {
                showNotification(result.message, 'error');
            }
        });

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm');

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailError = document.getElementById('emailError');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!emailRegex.test(this.value)) {
                    emailError.classList.add('show');
                } else {
                    emailError.classList.remove('show');
                }
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const passwordError = document.getElementById('passwordError');
                const hasUpperCase = /[A-Z]/.test(this.value);
                const hasLowerCase = /[a-z]/.test(this.value);
                const hasNumber = /[0-9]/.test(this.value);

                if (this.value.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumber) {
                    passwordError.textContent = 'Password must be 8+ chars with uppercase, lowercase, and number';
                    passwordError.classList.add('show');
                } else {
                    passwordError.classList.remove('show');
                }
            });
        }

        if (confirmInput) {
            confirmInput.addEventListener('input', function() {
                const confirmError = document.getElementById('confirmError');
                if (this.value !== passwordInput.value) {
                    confirmError.classList.add('show');
                } else {
                    confirmError.classList.remove('show');
                }
            });
        }
    }
});


function createLoginModal() {
    if (document.getElementById('login-modal')) return;

    const modalHTML = `
        <div id="login-modal" class="auth-modal">
            <div class="auth-modal-content">
                <span class="auth-modal-close">&times;</span>
                <h2 class="auth-modal-title">Log In</h2>
                <form id="login-form" class="auth-form">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" required>
                        <div class="error" id="login-email-error">Please enter a valid email</div>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" required>
                        <div class="error" id="login-password-error">Password is required</div>
                    </div>
                    <button type="submit" class="form__button">Log In</button>
                </form>
                <p class="auth-switch">Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const result = authSystem.logIn(email, password);

        if (result.success) {
            showNotification(result.message, 'success');
            closeLoginModal();
            authSystem.updateUIForLoggedInUser();
        } else {
            showNotification(result.message, 'error');
        }
    });

    const closeBtn = document.querySelector('.auth-modal-close');
    const modal = document.getElementById('login-modal');

    closeBtn.addEventListener('click', closeLoginModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLoginModal();
        }
    });
}

function openLoginModal() {
    createLoginModal();
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}


function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    const navMain = document.querySelector('.nav-main');
    
    if (navMain && !authSystem.isLoggedIn()) {
        const loginButton = document.createElement('li');
        loginButton.className = 'nav-main__item';
        loginButton.innerHTML = `
            <a href="#" class="nav-main__link" id="login-button-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </a>
        `;
        
        navMain.insertBefore(loginButton, navMain.firstChild);
        
        document.getElementById('login-button-header').addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
    }
});

window.authSystem = authSystem;
window.showNotification = showNotification;