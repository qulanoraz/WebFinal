document.addEventListener('DOMContentLoaded', function() {
    const showLoginLink = document.getElementById('show-login-from-signup');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.openLoginModal) {
                window.openLoginModal();
            }
        });
    }
});