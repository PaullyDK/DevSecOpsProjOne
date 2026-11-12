        // Ensure the user is logged in via the session
        async function checkSession() {
            try {
                const response = await fetch('/session', {
                    credentials: 'include', // Include session cookies
                });

                if (response.status === 401) {
                    window.location.href = 'login.html';
                }

                const userData = await response.json();
                document.getElementById('email').value = userData.email;
            } catch (error) {
                console.error('Error fetching session:', error);
                alert('Unable to fetch user data. Redirecting to login.');
                window.location.href = 'login.html';
            }
        }

        // Handle form submission to update profile
        document.getElementById('profile-form').addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                document.getElementById('error-message').style.display = 'block';
                return;
            }

            // Update user data via the backend
            try {
                const response = await fetch('/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include session cookies
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    // Show success message
                    document.getElementById('error-message').style.display = 'none';
                    document.getElementById('success-message').style.display = 'block';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Failed to update profile. Please try again.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred. Please try again.');
            }
        });

        // Logout functionality
        document.getElementById('logout').addEventListener('click', async function () {
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    credentials: 'include', // Include session cookies
                });

                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('An error occurred during logout. Please try again.');
            }
        });

        // Fetch user data on page load
        checkSession();
