const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const successMessage = document.getElementById('successMessage');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let isValid = true;
    // Clear previous error messages
    emailError.classList.remove('show');
    passwordError.classList.remove('show');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate email
    if (!emailRegex.test(email)) {
        emailError.classList.add('show');
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        passwordError.classList.add('show');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('http://localhost:4444/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.classList.add('show');
            successMessage.textContent = 'Login successful! Redirecting...';

            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 1000);
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});

// Real-time validation
emailInput.addEventListener('blur', function() {
    if (this.value && !emailRegex.test(this.value)) {
        emailError.classList.add('show');
    } else {
        emailError.classList.remove('show');
    }
});

passwordInput.addEventListener('blur', function() {
    if (this.value && this.value.length < 6) {
        passwordError.classList.add('show');
    } else {
        passwordError.classList.remove('show');
    }
});
