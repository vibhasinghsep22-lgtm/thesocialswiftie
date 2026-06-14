# 🍌 Nano-Banana Real-Time Trend Creative Ad Studio

A full-stack AI-powered marketing asset generator that monitors culture-velocity trends (Instagram Reels, LinkedIn, high-velocity culture grids) and instantly compiles premium, ready-to-run advertising creatives.

Features a beautiful interactive canvas with customized brand presets, and **Nano-Banana**—our dual-mode AI visual generator utilizing high-intelligence models with a reliable visual fallback.

---

## 🚀 How to Run Locally

If you want to pull down this code and run it on your own computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### 2. Install Dependencies
Run the following command at the root of the project:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file at the root of the database:
```env
# Get a free Gemini API Key at https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Direct Start (Dev Server)
To run the full-stack development server with hot reload:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐙 How to Deploy to GitHub

You can export this codebase from Google AI Studio directly to a private or public GitHub repository in 1-click:

1. Click on the **Settings (Gear Icon)** in the top bar of AI Studio.
2. Select **Export to GitHub** or **Download ZIP**.
3. Follow the onscreen workflow to authenticate with your GitHub account and create the repository.

---

## ⚡ How to Deploy to Vercel

We have pre-configured this project so that it is **100% Vercel-compatible** immediately out-of-the-box using Vercel Serverless Functions.

### 1. Connect Vercel to your GitHub Repository
1. Go to [Vercel](https://vercel.com/) and log in.
2. Click **Add New** -> **Project**.
3. Import your newly exported GitHub repository.

### 2. Configure Environment Variables
Before clicking **Deploy**, open the **Environment Variables** accordion and add:
- **Key**: `GEMINI_API_KEY`
- **Value**: `[Your real Google Gemini API Key]` (Retrieve yours from [Google AI Studio](https://aistudio.google.com/)).

*Note: If you have your own Gemini API Key, adding it to Vercel ensures that all core marketing-trend listening tools work at peak intelligence without hitting community platform rate-limits.*

### 3. Click Deploy!
Vercel will build the frontend into static assets and deploy the backend Express endpoints to serverless endpoints automatically using our pre-included `/vercel.json` routing matrix!

---

## 🛠️ How this Project is Structured

- `/server.ts` : Unified Node.js Express server housing the trend aggregation algorithms, prompt enrichment systems, and dynamic CORS image proxies.
- `/src/` : Frontend single-page application crafted with React 19, Vite, Tailwind CSS, and `motion` animations.
- `/api/index.ts` : Serverless entrypoint wrapping our Express app for Vercel deployment.
- `/vercel.json` : Custom routing configuration managing rewrite paths between the frontend SPA container and backend Serverless endpoints.
