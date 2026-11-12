    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get user input
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Send login data to the server
            console.log('Before fetch call');
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Include cookies with the request
            });
            console.log('After fetch call, response.ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();

                // Redirect to the protected page
                window.location.href = 'index.html';
            } else {
                // Show error message
                document.getElementById('error-message').style.display = 'block';
            }
        } catch (error) {
            console.error('Error logging in:', error);
            document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
            document.getElementById('error-message').style.display = 'block';
        }
    });

    document.getElementById('guest-btn').addEventListener('click', async function() {
        const msg = document.getElementById('error-message');
        try {
            const response = await fetch('/guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                msg.textContent = 'Could not start a guest session. Please try again.';
                msg.style.display = 'block';
            }
        } catch (error) {
            console.error('Error starting guest session:', error);
            msg.textContent = 'An error occurred. Please try again.';
            msg.style.display = 'block';
        }
    });
