        // Ensure the user is logged in via session
        async function checkSession() {
            try {
                const response = await fetch('/session', {
                    credentials: 'include', // Include session cookies
                });
                if (!response.ok) {
                    window.location.href = 'login.html'; // Redirect if session is invalid
                }
            } catch (error) {
                console.error('Error checking session:', error);
                window.location.href = 'login.html'; // Redirect on error
            }
        }

        // Logout functionality
        document.getElementById('logout').addEventListener('click', async function (e) {
            e.preventDefault();
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
                console.error('Error logging out:', error);
            }
        });

        // Retirement Calculator Logic
        document.getElementById('retirement-form').addEventListener('submit', function (e) {
            e.preventDefault();

            // Get input values
            const currentAge = parseFloat(document.getElementById('current-age').value);
            const retirementAge = parseFloat(document.getElementById('retirement-age').value);
            const monthlySavings = parseFloat(document.getElementById('monthly-savings').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;

            // Validate input values
            if (currentAge < 0 || retirementAge <= currentAge || monthlySavings <= 0 || interestRate < 0) {
                document.getElementById('result').innerHTML = `<p class="error">Please enter valid values. Ensure retirement age is greater than your current age.</p>`;
                return;
            }

            // Calculate the total savings
            const yearsToRetirement = retirementAge - currentAge;
            const monthsToRetirement = yearsToRetirement * 12;
			const futureValue = monthlySavings * (((Math.pow(1 + interestRate / 12, monthsToRetirement) - 1) / (interestRate / 12)));
            // Display the result
            document.getElementById('result').innerHTML = `<p>By the time you retire, you will have saved: <strong>$${futureValue.toFixed(2)}</strong></p>`;
        });

        // On page load, verify session
        checkSession();
