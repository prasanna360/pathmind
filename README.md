# Personalized AI Learning Path

Your single-file HTML app is now a **React frontend** + **Node.js (Express) backend**.

## Project structure

```
pathmind-app/
├── client/          React app (Vite)
├── server/          Node.js API (Express)
├── legacy/          Your original index.html (backup)
└── package.json     Run both together
```

## What changed

| Before (HTML only) | After (React + Node.js) |
|---|---|
| Data in `localStorage` | Saved on the server (`server/data/users.json`) |
| All logic in one file | Split into React components + API routes |
| Open HTML in browser | Run dev servers and use `http://localhost:5173` |

## Step 1 — Install Node.js

Install the current Node.js LTS release from:

https://nodejs.org/

After installing, **close and reopen** your terminal, then verify:

```powershell
node --version
npm --version
```

## Step 2 — Install dependencies

Open a terminal in this folder (`pathmind-app`) and run:

```powershell
cd "C:\Users\LAKSHMI\OneDrive\Desktop\New folder\pathmind-app"
npm install
npm run install:all
```

## Step 3 — Run the app

```powershell
npm run dev
```

This starts:

- **Backend API** → http://localhost:5000
- **React frontend** → http://localhost:5173

Open **http://localhost:5173** in your browser.

## API endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| PUT | `/api/users/interests` | Update interests |
| POST | `/api/users/lesson-complete` | Save lesson completion |
| POST | `/api/users/project-complete` | Save a portfolio project |
| POST | `/api/users/exam-result` | Save exam score |
| GET | `/api/exams/questions/:topic` | Get exam questions |
| GET | `/api/resources/:key/:week` | Get lesson resources |
| POST | `/api/resources` | Add a resource |

## Learner features

- Select multiple coding languages from **Edit Interests**. Each language has independent lessons, projects, exams, and progress.
- Use **Today's Focus** to open the next lesson for the primary selected path.
- Submit a project title, description, and optional work link from the final curriculum week.
- Project and lesson progress is stored in `server/data/users.json` during local development.

## Environment setup

Copy `.env.example` to `.env` and replace every placeholder before starting the server. Never commit `.env`, Supabase service-role keys, JWT secrets, or user data. If a real secret has ever been shared or committed, rotate it in the provider dashboard before publishing.

## Production build

```powershell
npm run build
npm start
```

Serves the built React app from the Node.js server on port 5000.

## Your original file

Your original app is preserved at:

- `legacy/index.html` — full original file
- `legacy-app.js` — extracted JavaScript (reference)
