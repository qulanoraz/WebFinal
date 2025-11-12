const form = document.querySelector('.registration__form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    document.querySelectorAll('.error').forEach((element) => {
        element.style.display = 'none';
    });

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");

    let valid = true;

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmValue = confirm.value.trim();

    if (!emailValue.includes('@') || !emailValue.includes('.')) {
        const emailError = document.querySelector('.emailError');
        emailError.style.display = 'block';
        valid = false;
    }

    if (passwordValue.length < 8) {
        const passwordError = document.querySelector('.passwordError');
        passwordError.style.display = 'block';
        valid = false;
    }

    if (passwordValue !== confirmValue) {
        const confirmError = document.querySelector('.confirmError');
        confirmError.style.display = 'block';
        valid = false;
    }

    if (valid) {
        setTimeout(() => {
            alert('Registration successful!');
            form.reset();  
        }, 500)
    }
});


const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        content.classList.toggle('open');
      });
});