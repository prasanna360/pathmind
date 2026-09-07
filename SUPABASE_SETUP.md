# Supabase Setup Guide for PathMind

This project is already a React app with an Express backend. The current app stores user data in local JSON files by default. To add Supabase, you can keep the app working as-is while wiring in Supabase environment variables and a database-ready structure for future production use.

## 1) Create a Supabase project

1. Go to https://supabase.com
2. Click Sign up or Log in.
3. Click New project.
4. Choose your organization.
5. Fill in:
   - Project name: `pathmind-app`
   - Database password: choose a strong password and save it somewhere safe.
   - Region: pick the nearest region to your users.
6. Wait for the project to finish creating.

Once it is ready, you will see:
- Project URL
- Anon key
- Service role key

These are required in the next step.

## 2) Create your local environment file

In the project root, copy the example file:

```bash
cp .env.example .env
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then open `.env` and replace the values:

```env
PORT=5000
JWT_SECRET=replace-with-a-secure-secret
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Important:
- `SUPABASE_URL` comes from your Supabase project settings.
- `SUPABASE_ANON_KEY` is the public anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY` is private and should not be exposed in the browser.
- `JWT_SECRET` can be any long random text.

## 3) Install backend dependencies

From the project root:

```bash
cd "C:\Users\LAKSHMI\OneDrive\Desktop\New folder\pathmind-app"
npm install
npm install --prefix server
npm install --prefix client
```

Your root `package.json` already starts both apps together.

## 4) Prepare the database in Supabase

Go to the Supabase dashboard:

1. Click SQL editor.
2. Click New query.
3. Paste the following SQL and run it.

```sql
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  age integer,
  interests text[] default '{}',
  free_time integer default 60,
  instrument text,
  streak integer default 1,
  hours_learned integer default 0,
  badges integer default 0,
  created_at timestamptz default now()
);

create table if not exists exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  topic text not null,
  score integer not null,
  correct integer not null,
  wrong integer not null,
  time_taken text,
  created_at timestamptz default now()
);

create table if not exists learning_resources (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  week integer not null,
  title text not null,
  url text not null,
  type text default 'article',
  created_by text,
  created_at timestamptz default now()
);
```

## 5) Turn on Row Level Security (RLS)

In Supabase:

1. Click Authentication > Policies.
2. Go to Table editor > profiles.
3. Enable RLS.
4. Add a simple policy for authenticated users:

```sql
create policy "Users can read their own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);
```

For `exam_results` and `learning_resources`, create similar RLS rules or use a service-role-only path when working server-side.

## 6) Create auth settings (optional but recommended)

1. Go to Authentication > Providers.
2. Enable Email sign-in.
3. Optionally enable Google or GitHub login later.
4. Set redirect URLs for local dev:
   - `http://localhost:5173`
   - `http://localhost:3000`

## 7) Run the app locally

From the project root:

```bash
npm run dev
```

This starts:
- frontend on http://localhost:5173
- backend on http://localhost:5000

## 8) Connect the backend to Supabase

The project now includes a Supabase client helper in:

- `server/supabaseClient.js`

This file reads from your `.env` values and initializes the Supabase client if the project is configured.

The current app still keeps its Express fallback storage for backward compatibility. That makes migration safer for beginners.

## 9) Check whether the connection works

With the backend running, open this URL in your browser:

```text
http://localhost:5000/api/health
```

You should see:

```json
{
  "ok": true,
  "supabase": {
    "enabled": true,
    "database": "connected"
  }
}
```

If you see `enabled: false` or `database: not-configured`, restart the backend after checking `.env`.

## 10) Check a newly added resource

When Supabase is configured, the Add a Resource form writes to the `learning_resources` table.

In Supabase:

1. Open your project.
2. Click Table Editor.
3. Open `learning_resources`.
4. Click the refresh button.
5. Look for the title, URL, topic key, week, and `created_at` timestamp.

You can also inspect the API data through the authenticated app. The browser network request should be:

```text
POST http://localhost:5173/api/resources
```

The response should have status `201` and include the newly inserted resource.

## 11) Recommended migration path

For a real production project, move user storage from local JSON to Supabase tables:

- User auth: Supabase Auth
- Profile data: `profiles`
- Exam history: `exam_results`
- Learning resources: `learning_resources`
- API logic: keep Express as the backend layer and call Supabase from there

## 12) Common beginner mistakes

- Forgetting to copy `.env.example` to `.env`
- Using the service-role key in frontend code
- Not enabling RLS
- Using the wrong URL or anon key
- Forgetting to save the database password in a safe place

## 13) Useful Supabase commands

In the dashboard, you can inspect:
- Table editor
- SQL editor
- Authentication
- Storage
- Logs

You can also test queries in SQL editor like:

```sql
select * from profiles;
```

## 14) What to do next

If you want, the next upgrade is to fully replace the local JSON data layer with Supabase-backed queries for:

- signup/login
- fetching user profile
- saving exam results
- adding learning resources

This project is already structured so the migration path is clear and manageable.
