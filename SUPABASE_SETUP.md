# Supabase and Vercel Setup

The app uses Supabase for persistent account and lesson-resource storage in production. Keep the Supabase service-role key in the API project's environment only; never put it in frontend code.

## 1. Create the Supabase tables

In the Supabase dashboard, open **SQL Editor**, create a query, paste the contents of [`server/data/supabase-schema.sql`](./server/data/supabase-schema.sql), and run it.

Row Level Security is enabled on both tables. The app accesses them through the server using the service-role key, so do not add public policies for these tables.

## 2. Deploy the API to Vercel

Import the GitHub repository as a Vercel project and set **Root Directory** to `server`. Vercel detects the exported Express app in `index.js`.

Add these environment variables to the API project for Production (and Preview if you use preview deployments):

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Project URL from Supabase project settings |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private server-side service-role key |
| `JWT_SECRET` | A long, random secret used to sign login tokens |
| `CLIENT_ORIGINS` | Exact frontend origin, such as `https://your-app.vercel.app`, no trailing slash |

Deploy the API and copy its deployment origin.

## 3. Deploy the frontend to Vercel

Create a second Vercel project from the same GitHub repository and set **Root Directory** to `client`. Vercel should detect Vite.

Set `VITE_API_BASE_URL` to the API deployment URL followed by `/api`, for example `https://your-api.vercel.app/api`, then deploy the frontend. Add the final frontend origin to `CLIENT_ORIGINS` in the API project's settings and redeploy the API if needed.

For Preview deployments, set matching Preview environment variables. `CLIENT_ORIGINS` accepts a comma-separated list of exact origins.

## Local development

Copy `.env.example` to `.env` and set your values. Run `npm run dev` from the repository root. By default, local sign-in and profile data continue to use `server/data/users.json`; set `USE_SUPABASE_USER_STORAGE=true` only when you want local account writes to use the Supabase `app_users` table.

Existing local accounts in `server/data/users.json` are not migrated automatically. Create a new account in the deployed app. Never commit `.env`, user records, or secrets.
