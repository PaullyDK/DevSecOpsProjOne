# Financial Planner

A full-stack web app for tracking budgets and transactions. Also includes a retirement savings projection.

This project began as my university capstone, but recently I have made it live and begun to work on it again.

Website is live here: https://financial-planner-production-e6cc.up.railway.app

Click **Try it as a guest** on the login page for a pre-loaded demo account (no signup needed).

## Dashboard

!\[Dashboard](images/dashboard.png)

## Budget Screen

!\[Budgets](images/budgets.png)

## How to download and run locally (MacOS):

1. Requires node.js and MySQL.
2. `npm install` in the root folder installs the dependencies.
3. Start MySQL
4. Then run `mysql -u root -p -e "CREATE DATABASE financial\\\\\\\_planner;"` and `mysql -u root -p financial\\\\\\\_planner < schema.sql` to populate the database with the correct schema.
5. Copy this into a file named `.env`. Replace the two bracketed values with your own, the rest are fine as-is for local development.

```sh
DB\\\\\\\_HOST=localhost
DB\\\\\\\_USER=root
DB\\\\\\\_PASSWORD=<your\\\\\\\_mysql\\\\\\\_password>
DB\\\\\\\_NAME=financial\\\\\\\_planner
SESSION\\\\\\\_SECRET=<any\\\\\\\_long\\\\\\\_random\\\\\\\_string>
PORT=3000
NODE\\\\\\\_ENV=development
```

5. Run `npm start`
6. Go to http://localhost:3000 and the website should be working!

If you have any issues running this please let me know and I can update the readme with better instructions.

