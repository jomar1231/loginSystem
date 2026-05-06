const registerForm = document.getElementById('registerForm');
const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('termsCheckbox');

const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordErrors(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push('At least 8 characters');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('One lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('One uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('One number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]/.test(password)) {
        errors.push('One special character');
    }
    return errors;
}

function showError(element, message) {
    if (!element) return;
    element.innerHTML = message;
    element.classList.add('show');
}

function hideError(element) {
    if (!element) return;
    element.classList.remove('show');
}

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let isValid = true;

    hideError(fullNameError);
    hideError(emailError);
    hideError(passwordError);
    hideError(confirmPasswordError);

    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (firstname.length < 3) {
        showError(fullNameError, 'First name must be at least 3 characters');
        isValid = false;
    }

    if (lastname.length < 3) {
        showError(fullNameError, 'Last name must be at least 3 characters');
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }

    const passwordErrors = getPasswordErrors(password);
    if (passwordErrors.length > 0) {
        showError(passwordError, 'Password must contain:<br>' + passwordErrors.map(err => `• ${err}`).join('<br>'));
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError(confirmPasswordError, 'Passwords do not match');
        isValid = false;
    }

    if (!termsCheckbox.checked) {
        alert('Please agree to the terms and conditions');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('http://localhost:4444/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Redirecting to login...');
            window.location.href = '/login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
});

passwordInput.addEventListener('input', function () {
    const errors = getPasswordErrors(this.value);
    if (errors.length > 0) {
        showError(passwordError, 'Password must contain:<br>' + errors.map(err => `• ${err}`).join('<br>'));
    } else {
        hideError(passwordError);
    }

    if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
        showError(confirmPasswordError, 'Passwords do not match');
    } else if (confirmPasswordInput.value) {
        hideError(confirmPasswordError);
    }
});

confirmPasswordInput.addEventListener('input', function () {
    if (this.value && this.value !== passwordInput.value) {
        showError(confirmPasswordError, 'Passwords do not match');
    } else {
        hideError(confirmPasswordError);
    }
});

firstnameInput.addEventListener('blur', function () {
    if (this.value.trim().length > 0 && this.value.trim().length < 3) {
        showError(fullNameError, 'First name must be at least 3 characters');
    } else {
        hideError(fullNameError);
    }
});

lastnameInput.addEventListener('blur', function () {
    if (this.value.trim().length > 0 && this.value.trim().length < 3) {
        showError(fullNameError, 'Last name must be at least 3 characters');
    } else {
        hideError(fullNameError);
    }
});

emailInput.addEventListener('blur', function () {
    if (this.value && !emailRegex.test(this.value.trim())) {
        showError(emailError, 'Please enter a valid email address');
    } else {
        hideError(emailError);
    }
});
