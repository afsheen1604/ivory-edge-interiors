-- =============================================================================
-- Ivory Edge Interiors — Migration 0003
-- users (admin profiles)
-- =============================================================================
--
-- Supabase Auth (`auth.users`) owns credentials, sessions, and password
-- hashes. This table extends that with the application-level profile data
-- and role used for authorization throughout the app. Visitors never get a
-- row here — only admins, created via the Supabase Auth admin API after
-- being invited (covered in Phase 4: Authentication).

create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  full_name     text not null,
  role          public.user_role not null default 'admin',
  avatar_url    text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint users_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

comment on table public.users is
  'Admin profile data, 1:1 with auth.users. Only admins (the founder/team) get a row.';

create index users_role_idx on public.users (role);

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Helper: is the current request authenticated as an active admin?
-- Used throughout RLS policies on every other table.
-- SECURITY DEFINER + fixed search_path so it can read public.users regardless
-- of caller-level RLS, without being hijackable via search_path tricks.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

comment on function public.is_admin() is
  'True if the currently authenticated user is an active admin. Used in RLS policies.';

alter table public.users enable row level security;

-- Admins can read/update their own profile. No public access — this table
-- never needs to be readable by visitors.
create policy "Admins can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
