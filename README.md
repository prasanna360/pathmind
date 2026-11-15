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

Copy `.env.example` to `.env` and replace every placeholder before starting the server. Registration accepts syntactically valid email addresses; sign-in is available only for accounts already registered with the matching password. Never commit `.env`, Supabase service-role keys, JWT secrets, or user data. If a real secret has ever been shared or committed, rotate it in the provider dashboard before publishing.

## Deploy the full app with Vercel

The frontend and Express API are deployed as two Vercel projects from this repository. Supabase stores accounts and learning resources because Vercel functions do not have persistent local storage.

1. In Supabase, run [`server/data/supabase-schema.sql`](./server/data/supabase-schema.sql) in the SQL Editor.
2. Import the GitHub repository into Vercel twice:
   - Frontend project: set **Root Directory** to `client`; use the Vite defaults (`npm run build`, output directory `dist`).
   - API project: set **Root Directory** to `server`; Vercel detects the exported Express app in `index.js`.
3. Deploy the API project first. In its Vercel project settings, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (use a long, random value)
   - `CLIENT_ORIGINS` (the exact deployed frontend origin, such as `https://your-app.vercel.app`, without a trailing slash)
4. In the frontend Vercel project, set `VITE_API_BASE_URL` to the API deployment URL plus `/api`, for example `https://your-api.vercel.app/api`, then redeploy the frontend.
5. In Supabase, keep the service-role key private and never add it to the frontend project.

Local accounts in `server/data/users.json` are not copied to Supabase; create a new account after deploying. Locally, the app continues to use its JSON-file store unless `USE_SUPABASE_USER_STORAGE=true` is set.

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
