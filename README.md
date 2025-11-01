🎧 Voice Agent Analytics Dashboard

A modern React + TypeScript web application to visualize and manage voice agent analytics, inspired by the design system of SuperBryn
.

🔗 Live Demo: https://call-analytics-visualizer.vercel.app/

🧠 Project Overview

This dashboard helps visualize call analytics for AI voice agents, including call duration trends and failure causes (“sad paths”).
Users can update chart values in real time, store their custom data securely in Supabase, and restore previous values upon login.

✨ Features

✅ SuperBryn-style theme — sleek dark mode with glowing green accents
✅ 📈 Interactive Charts — visualize call duration & sad path analytics
✅ 💾 Supabase Integration — save and fetch data per email address
✅ ⚡ Real-time updates — instantly reflects changes on charts
✅ 🔐 Smart overwrite prompt — asks before replacing previous data
✅ 🌐 Deployed on Vercel — responsive, fast, and globally available

🧩 Tech Stack
Category	Technology
Frontend Framework	React 18 + TypeScript
Data Visualization	Recharts
Backend / Database	Supabase (PostgreSQL)
Styling	Custom CSS with Superbryn-inspired layout
Deployment	Vercel Cloud
Version Control	Git + GitHub
🖥️ Live Demo

🌐 Hosted App:
👉 https://call-analytics-visualizer.vercel.app/

🧱 GitHub Repo:
👉 https://github.com/codingwithrsn33/call-analytics-visualizer

🧰 Installation Guide

To run this project locally:

# 1️⃣ Clone the repository
git clone https://github.com/codingwithrsn33/call-analytics-visualizer.git

# 2️⃣ Navigate into the folder
cd call-analytics-visualizer

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm start


Your app will be running at 👉 http://localhost:3000/

⚙️ Supabase Setup

Create a new table called call_data in your Supabase project:

Column	Type	Description
id	int4	Primary Key
created_at	timestamp	Default: now()
email	text	User email
chart_values	json	Stores chart data

Then, in your project root, create a .env file:

### 🔗 Supabase Project
The project uses Supabase as the backend for storing user chart data.

**Supabase API URL:** `https://tgqdaayhmhjtjpaytwzb.supabase.co`

*(Note: This endpoint is for API access, not for public viewing. Data is securely managed via the app.)*

🧠 How It Works

User enters their email to continue.

App checks if previous chart data exists in Supabase.

If yes — shows a summary and asks permission to overwrite.

User edits data → clicks “Save My Data” → data stored in Supabase.

Next login → dashboard loads previous saved data automatically.

📊 Analytics Visualization
Call Duration Analysis

Displays the average duration of voice calls (line chart).

Users can modify values and instantly see updated graphs.

Sad Path Analysis

Visualizes call failure reasons (pie chart).

Uses color-coded sections for each issue category.

🌐 Deployment

The app is deployed via Vercel Cloud for fast, serverless hosting.

To deploy your own version:

npm run build


Then push your project to GitHub and connect it to Vercel
.
Vercel auto-detects React apps and deploys them with a live HTTPS link.

🏁 Summary

This project demonstrates:

Frontend expertise with React + TypeScript

Integration of cloud database (Supabase)

Real-time data visualization using Recharts

Elegant UI/UX inspired by SuperBryn

Full CI/CD deployment using Vercel

👨‍💻 Author

Rohan S.
Frontend Developer | Python + Django Enthusiast | AI Developer in Progress

📧 Email: rohandarekar307@gmail.com

🌐 GitHub: codingwithrsn33

🚀 Live App: call-analytics-visualizer.vercel.app
