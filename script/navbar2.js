const navLinks = document.querySelectorAll('.nav-links__item a');
const navMainLinks = document.querySelectorAll('.nav-main__link');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', function(e) {
    e.preventDefault();
    this.style.transform = 'scale(1.2) rotate(360deg)';
    setTimeout(() => {
        this.style.transform = 'scale(1) rotate(0deg)';
    }, 600);
});

const profileButton = document.getElementById('profile-button');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

profileButton.addEventListener('click', function(e) {
    e.preventDefault();
    openSidebar();
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// ============================================
// THEME SWITCHER FUNCTIONALITY
// ============================================

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);

// Theme switcher button
const themeSwitcher = document.getElementById('theme-switcher');

function updateThemeDisplay() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (themeSwitcher) {
        if (currentTheme === 'light') {
            themeSwitcher.innerHTML = `
                <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>Light Mode</span>
            `;
        } else {
            themeSwitcher.innerHTML = `
                <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Dark Mode</span>
            `;
        }
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth change
    document.body.classList.add('theme-transitioning');
    
    // Change theme
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update display
    updateThemeDisplay();
    
    // Update i18next translation
    const themeText = newTheme === 'light' ? 'Light Mode' : 'Dark Mode';
    if (i18next && i18next.language) {
        i18next.addResource('en', 'translation', 'currentTheme', themeText);
        i18next.addResource('ru', 'translation', 'currentTheme', newTheme === 'light' ? 'Светлая тема' : 'Тёмная тема');
        i18next.addResource('kz', 'translation', 'currentTheme', newTheme === 'light' ? 'Ашық режим' : 'Қараңғы режим');
    }
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 300);
}

// Initialize theme display
updateThemeDisplay();

// Add click event to theme switcher
if (themeSwitcher) {
    themeSwitcher.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
}

// ============================================
// INTERNATIONALIZATION (i18next)
// ============================================

i18next.init({
    lng: localStorage.getItem('selectedLanguage') || 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
                profile: 'Profile',
                languageSettings: 'Language Settings',
                selectLanguage: 'Select Language',
                accountInfo: 'Account Information',
                username: 'Username',
                email: 'Email',
                memberSince: 'Member Since',
                preferences: 'Preferences',
                theme: 'Theme',
                notifications: 'Notifications',
                darkMode: 'Dark Mode',
                lightMode: 'Light Mode',
                enabled: 'Enabled',
                home: 'Home',
                movies: 'Movies',
                series: 'Series',
                collection: 'Collection',
                memberDate: 'November 2025',
                currentTheme: localStorage.getItem('theme') === 'light' ? 'Light Mode' : 'Dark Mode'
            }
        },
        ru: {
            translation: {
                profile: 'Профиль',
                languageSettings: 'Настройки языка',
                selectLanguage: 'Выберите язык',
                accountInfo: 'Информация об аккаунте',
                username: 'Имя пользователя',
                email: 'Электронная почта',
                memberSince: 'Участник с',
                preferences: 'Предпочтения',
                theme: 'Тема',
                notifications: 'Уведомления',
                darkMode: 'Тёмная тема',
                lightMode: 'Светлая тема',
                enabled: 'Включено',
                home: 'Главная',
                movies: 'Фильмы',
                series: 'Сериалы',
                collection: 'Коллекция',
                memberDate: 'Ноябрь 2025',
                currentTheme: localStorage.getItem('theme') === 'light' ? 'Светлая тема' : 'Тёмная тема'
            }
        },
        kz: {
            translation: {
                profile: 'Профиль',
                languageSettings: 'Тіл параметрлері',
                selectLanguage: 'Тілді таңдаңыз',
                accountInfo: 'Аккаунт туралы ақпарат',
                username: 'Пайдаланушы аты',
                email: 'Электрондық пошта',
                memberSince: 'Мүшелік басталды',
                preferences: 'Баптаулар',
                theme: 'Тақырып',
                notifications: 'Хабарландырулар',
                darkMode: 'Қараңғы режим',
                lightMode: 'Ашық режим',
                enabled: 'Қосулы',
                home: 'Басты бет',
                movies: 'Фильмдер',
                series: 'Сериалдар',
                collection: 'Коллекция',
                memberDate: 'Қараша 2025',
                currentTheme: localStorage.getItem('theme') === 'light' ? 'Ашық режим' : 'Қараңғы режим'
            }
        }
    }
}).then(() => {
    updateLanguage(i18next.language);
});

function updateLanguage(lang) {
    i18next.changeLanguage(lang).then(() => {
        document.querySelector('.sidebar-title').textContent = i18next.t('profile');
        document.querySelectorAll('.sidebar-section-title')[0].textContent = i18next.t('languageSettings');
        document.querySelectorAll('.sidebar-section-title')[1].textContent = i18next.t('accountInfo');
        document.querySelectorAll('.sidebar-section-title')[2].textContent = i18next.t('preferences');
        
        const labels = document.querySelectorAll('.sidebar-item label');
        labels[0].textContent = i18next.t('selectLanguage');
        labels[1].textContent = i18next.t('username');
        labels[2].textContent = i18next.t('email');
        labels[3].textContent = i18next.t('memberSince');
        labels[4].textContent = i18next.t('theme');
        labels[5].textContent = i18next.t('notifications');
        
        document.querySelectorAll('.sidebar-item-value')[2].textContent = i18next.t('memberDate');
        document.querySelectorAll('.sidebar-item-value')[4].textContent = i18next.t('enabled');
        
        // Update theme button text
        const currentTheme = document.body.getAttribute('data-theme');
        if (themeSwitcher) {
            const themeSpan = themeSwitcher.querySelector('span');
            if (themeSpan) {
                themeSpan.textContent = currentTheme === 'light' ? i18next.t('lightMode') : i18next.t('darkMode');
            }
        }
        
        const navLinks = document.querySelectorAll('.nav-links__item a');
        navLinks[0].textContent = i18next.t('home');
        navLinks[1].textContent = i18next.t('movies');
        navLinks[2].textContent = i18next.t('series');
        navLinks[3].textContent = i18next.t('collection');
        
        localStorage.setItem('selectedLanguage', lang);
    });
}

const sidebarLanguageSelector = document.getElementById('sidebar-language-selector');
if (sidebarLanguageSelector) {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    sidebarLanguageSelector.value = savedLanguage;
    
    sidebarLanguageSelector.addEventListener('change', function() {
        const selectedLanguage = this.value;
        updateLanguage(selectedLanguage);
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});