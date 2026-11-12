        // Initialize budgets and transactions
        let budgets = [];
        let transactions = [];

        async function fetchData() {
            try {
                // Fetch budgets and transactions from the server
                const budgetResponse = await fetch('/budgets', {
                    credentials: 'include', // Include session cookies
                });

                if (!budgetResponse.ok) {
                    // Redirect to login if unauthorized
                    if (budgetResponse.status === 401) {
                        window.location.href = 'login.html';
                        return;
                    }
                    throw new Error('Failed to fetch budgets');
                }

                budgets = await budgetResponse.json();

                const transactionResponse = await fetch('/transactions', {
                    credentials: 'include', // Include session cookies
                });

                transactions = await transactionResponse.json();

				console.log('Transactions Data:', transactions);

                renderBudgets();
                renderTransactions();
                updateOverview();
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('An error occurred. Please try again.');
            }
        }
        
        let monthlyIncome = 3500; // Default fallback

		async function fetchMonthlyIncome() {
    		try {
        		const response = await fetch('/monthly-income', {
            		credentials: 'include',
        		});

        		if (response.ok) {
            		const data = await response.json();
            		monthlyIncome = parseFloat(data.monthlyIncome) || 3500;
            		document.getElementById('monthly-income').textContent = `$${monthlyIncome.toFixed(2)}`;
            		updateOverview();
        		} else {
            		console.error('Failed to fetch monthly income');
        		}
    		} catch (error) {
        		console.error('Error fetching monthly income:', error);
    		}
		}
        
		// Calculate values dynamically
		function updateOverview() {
    		const totalBudgets = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
    		const totalSpent = transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

    		const unbudgeted = monthlyIncome - totalBudgets;
    		const leftToSpend = monthlyIncome - totalSpent;

    		document.getElementById('unbudgeted').textContent = `$${unbudgeted.toFixed(2)}`;
    		document.getElementById('left-to-spend').textContent = `$${leftToSpend.toFixed(2)}`;
		}

		// Handle editing monthly income
		document.getElementById('edit-income').addEventListener('click', async () => {
    		const newIncome = parseFloat(prompt('Enter your monthly income:', monthlyIncome));
    		if (!isNaN(newIncome) && newIncome > 0) {
        		try {
            		const response = await fetch('/monthly-income', {
                		method: 'PUT',
                		headers: { 'Content-Type': 'application/json' },
                		credentials: 'include',
                		body: JSON.stringify({ monthlyIncome: newIncome }),
            		});

            		if (response.ok) {
                		monthlyIncome = newIncome;
                		document.getElementById('monthly-income').textContent = `$${monthlyIncome.toFixed(2)}`;
                		updateOverview();
            		} else {
                		console.error('Failed to update monthly income');
            		}
        		} catch (error) {
            		console.error('Error updating monthly income:', error);
        		}
    		} else {
        		alert('Invalid income entered.');
    		}
		});

		// Initialize values on page load
		updateOverview();

        // Elements
        const budgetForm = document.getElementById('budget-form');
        const budgetList = document.getElementById('budget-list');
        const transactionList = document.getElementById('transaction-list');

        // Render Budgets
		function renderBudgets() {
    		budgetList.innerHTML = ''; // Clear the budget list
    		budgets.forEach(budget => {
        		
        		const budgetCategory = budget.category || 'Unknown'; // Default to 'Unknown'
        		const budgetAmount = parseFloat(budget.amount) || 0; // Default to 0 if invalid
        		
        		const totalSpent = transactions
            		.filter(txn => txn.budget_id === budget.id)
            		.reduce((sum, txn) => sum + (parseFloat(txn.amount) || 0), 0); // Default txn.amount to 0 if invalid

        		const progressPercent = Math.min((totalSpent / budgetAmount) * 100, 100);

        		const li = document.createElement('li');
        		li.innerHTML = `
            		<div class="budget-item">
                		<div>
                    		<strong>${budgetCategory}</strong>: $${totalSpent.toFixed(2)} / $${budgetAmount.toFixed(2)}
                		</div>
                		<div class="progress-container">
                    		<div 
                        		class="progress-bar" 
                        		style="width: ${progressPercent}%; background-color: ${
                            		totalSpent > budgetAmount ? 'red' : '#0077b6'
                        		};"
                    		></div>
                    		<span class="progress-label">${progressPercent.toFixed(2)}%</span>
                		</div>
                		<button class="add-transaction" data-id="${budget.id}">Add Transaction</button>
                		<button class="view-transactions" data-id="${budget.id}" data-category="${budget.category}">
                			View All Transactions
                		</button>
                		<button class="delete-budget" data-id="${budget.id}">Delete</button>
                		</div>
        		`;
        		budgetList.appendChild(li);
    		});

    		// Add event listeners
    		document.querySelectorAll('.add-transaction').forEach(btn => {
        		btn.addEventListener('click', async function () {
            		const budgetId = this.dataset.id;
            		const title = prompt('Enter Transaction Title:');
            		const amount = parseFloat(prompt('Enter Transaction Amount:'));
            		
            		if (budgetId && title && !isNaN(amount)) {
            			try {
            				await addTransaction(budgetId, title, amount);
            				await fetchData();
            				renderBudgets();
            			} catch (error) {
            				console.error('Error adding transaction:', error);
            				alert('Failed to add transacation. Please try again');
            			}
            		} else {
            			alert('Invalid transaction details. Please try again.');
            		}
        		});
    		});
    		
    		document.querySelectorAll('.delete-budget').forEach(btn => {
        		btn.addEventListener('click', async function () {
            		const budgetId = this.dataset.id;
            		await deleteBudget(budgetId);
        		});
    		});

    		document.querySelectorAll('.view-transactions').forEach(btn => {
        		btn.addEventListener('click', function () {
            		const budgetId = this.dataset.id;
            		const category = encodeURIComponent(this.dataset.category);
            		window.location.href = `transactions.html?budgetId=${budgetId}&category=${category}`;
        		});
    		});
		}

        // Render Last Five Transactions
        function renderTransactions() {
            transactionList.innerHTML = '';
            const recentTransactions = transactions.slice(-5).reverse(); // Get the last 5 transactions
            console.log('Recent transactions:', recentTransactions);
            recentTransactions.forEach(txn => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${txn.title}</strong> - $${parseFloat(txn.amount).toFixed(2)}`;
                transactionList.appendChild(li);
            });
        }

        // Add a Budget
        async function addBudget(category, amount) {
    		try {
        		const response = await fetch('/budgets', {
            		method: 'POST',
            		headers: { 'Content-Type': 'application/json' },
            		credentials: 'include', // Include session cookies
            		body: JSON.stringify({ category, amount }),
        		});

        		if (response.ok) {
            		const newBudget = await response.json();
            		console.log('New Budget:', newBudget); // Debug log

            		// Add the new budget to the budgets array and re-render
            		budgets.push(newBudget);
            		renderBudgets();
            		updateOverview();
        		} else {
            		const error = await response.json();
            		alert(error.error || 'Error adding budget');
        		}
    		} catch (error) {
        		console.error('Error adding budget:', error);
    		}
		}

        // Delete a Budget
        async function deleteBudget(budgetId) {
            try {
                const response = await fetch(`/budgets/${budgetId}`, {
                    method: 'DELETE',
                    credentials: 'include', // Include session cookies
                });
                
                if (response.ok) {
                    budgets = budgets.filter(budget => budget.id !== parseInt(budgetId));
                    
            		transactions = transactions.filter(txn => txn.budget_id !== parseInt(budgetId));

            		renderBudgets();
            		renderTransactions();
            		updateOverview();
                } else {
                    const error = await response.json();
           	 		alert(error.error || 'Error deleting budget');
                }
            } catch (error) {
                console.error('Error deleting budget:', error);
            }
        }
        
        // Add a transaction
        async function addTransaction(budgetId, title, amount) {
    		try {
        		const response = await fetch('/transactions', {
            		method: 'POST',
            		headers: { 'Content-Type': 'application/json' },
            		credentials: 'include', // Include session cookies
            		body: JSON.stringify({ budgetId, title, amount }),
        		});

        		if (response.ok) {
            		const newTransaction = await response.json();
            		console.log('New Transaction:', newTransaction);

            		// Add the new transaction to the transactions array
            		transactions.push(newTransaction);

            		// Re-render the transactions list
            		renderBudgets();
            		renderTransactions();
            		updateOverview();
        		} else {
            		const error = await response.json();
            		alert(error.error || 'Error adding transaction');
        		}
    		} catch (error) {
        		console.error('Error adding transaction:', error);
    		}
		}

        // Handle Budget Form Submission
        budgetForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const category = document.getElementById('category').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);

            await addBudget(category, amount);
            budgetForm.reset();
        });

        // Logout Functionality
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

        // Fetch Data on Page Load
        document.addEventListener('DOMContentLoaded', () => {
    		fetchMonthlyIncome(); // Fetch income from server
    		fetchData();          // Fetch budgets and transactions
		});
