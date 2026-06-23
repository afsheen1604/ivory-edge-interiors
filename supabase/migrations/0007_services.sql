-- =============================================================================
-- Ivory Edge Interiors — Migration 0007
-- services
-- =============================================================================
--
-- Powers the public Services page and admin Service Management. Seeded with
-- the five services from the brief (Residential Interiors, Commercial
-- Interiors, Turnkey Solutions, Space Planning, Furniture & Decor Styling)
-- in the seed data step — this migration only creates the table shape.

create table public.services (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text not null,
  image_url     text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint services_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint services_title_not_blank check (length(trim(title)) > 0)
);

comment on table public.services is
  'The service offerings shown on the public Services page, fully admin-editable.';
comment on column public.services.is_active is
  'Soft toggle to hide a service from the public site without deleting it.';

create index services_display_order_idx on public.services (display_order);
create index services_active_idx on public.services (is_active) where is_active = true;

create trigger services_set_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

alter table public.services enable row level security;

create policy "Public can view active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can view all services"
  on public.services for select
  using (public.is_admin());

create policy "Admins can insert services"
  on public.services for insert
  with check (public.is_admin());

create policy "Admins can update services"
  on public.services for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete services"
  on public.services for delete
  using (public.is_admin());
