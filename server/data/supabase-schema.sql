create table if not exists public.app_users (
  email text primary key check (email = lower(email)),
  user_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_users enable row level security;

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  week integer not null,
  title text not null,
  url text not null,
  type text default 'article',
  created_by text,
  created_at timestamptz not null default now()
);

alter table public.learning_resources enable row level security;
