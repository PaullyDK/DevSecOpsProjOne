        document.getElementById('register-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');

            // Clear previous messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            // Check if passwords match
            if (password !== confirmPassword) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Passwords do not match. Please try again.';
                return;
            }

            // Make API request to register the user
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    successMessage.style.display = 'block';
                    successMessage.textContent = 'Registration successful! Redirecting to login...';
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = data.error || 'Registration failed. Please try again.';
                }
            } catch (error) {
                console.error('Error registering user:', error);
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'An error occurred. Please try again later.';
            }
        });
