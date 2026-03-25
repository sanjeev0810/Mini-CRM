📁 Project Overview: Simple CRM
This project is divided into two main parts: the Back-End (the brain/engine) and the Front-End (the visual screen).

🧠 1. The Back-End (The "Brain")
This folder handles all the logic, security, and data storage.

middleware/auth.js: The "Security Guard." It checks if a user is logged in before letting them see or change data.

models/: The "Blueprints." These files define what information we save for a Company, Lead, Task, or User.

routes/: The "Delivery Routes." These files decide where data goes when you click a button (e.g., leads.js handles saving or deleting a lead).

server.js: The "Power Switch." This is the main file that starts the entire back-end engine.

.env: The "Secret Vault." This hides private keys and database passwords.

💻 2. The Front-End (The "Face")
This folder contains everything the user sees and clicks on.

src/pages/: The "Different Rooms."

Dashboard.jsx: The home screen with summary stats.

Leads.jsx / Companies.jsx: The lists where you view your data.

AddTask.jsx / AddLead.jsx: The forms you fill out to create new items.

Login.jsx: The entrance where you type your username and password.

src/layout/MainLayout.jsx: The "Template." This ensures the sidebar and top bar stay the same while you switch between pages.

src/services/api.js: The "Telephone Line." This is how the front-end "calls" the back-end to ask for data.

App.jsx: The "Map." This tells the browser which page to show based on the URL.

🛠️ How to Get Started (Beginner Friendly)
Step 1: Set up the Back-End
Open your terminal in the back-end folder.

Run npm install (Downloads the tools).

Run node server.js (Starts the brain).

Step 2: Set up the Front-End
Open a new terminal in the front-end folder.

Run npm install.

Run npm run dev.

Open your browser to the link shown (usually localhost:5173).

🌟 Key Technical Features (Mandatory)
Soft Delete: When you "Delete" a lead, it stays in the database but disappears from the screen.

Smart Dashboard: The stats on the home screen are calculated using advanced database math (Aggregation).

User Security: We use JWT (Digital Keys) and Bcrypt (Password Scrambling) to keep your account safe.

Private Routes: If you aren't logged in, the system will kick you back to the Login page.