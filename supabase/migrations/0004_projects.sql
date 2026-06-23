-- =============================================================================
-- Ivory Edge Interiors — Migration 0004
-- projects
-- =============================================================================

create table public.projects (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  description        text not null,
  category           public.project_category not null,
  location           text,
  completion_date    date,
  cover_image_url    text,
  status             public.project_status not null default 'draft',
  is_featured        boolean not null default false,
  display_order      integer not null default 0,
  created_by         uuid references public.users(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_title_not_blank check (length(trim(title)) > 0)
);

comment on table public.projects is
  'Portfolio projects shown on the public Projects page and Project Details page.';
comment on column public.projects.slug is
  'URL-friendly identifier, e.g. /projects/villa-jubilee-hills. Generated from title, editable by admin.';
comment on column public.projects.status is
  'draft = not visible publicly. published = visible. archived = hidden but retained for records.';

create index projects_category_idx on public.projects (category);
create index projects_status_idx on public.projects (status);
create index projects_featured_idx on public.projects (is_featured) where is_featured = true;
create index projects_display_order_idx on public.projects (display_order);
create index projects_completion_date_idx on public.projects (completion_date desc);

-- Full-text search across title, description and location, backing the
-- Projects page search box.
alter table public.projects
  add column search_vector tsvector
    generated always as (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(location, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) stored;

create index projects_search_idx on public.projects using gin (search_vector);

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;

-- Visitors: can read only published projects.
create policy "Public can view published projects"
  on public.projects for select
  using (status = 'published');

-- Admins: full read access (including drafts/archived) and full write access.
create policy "Admins can view all projects"
  on public.projects for select
  using (public.is_admin());

create policy "Admins can insert projects"
  on public.projects for insert
  with check (public.is_admin());

create policy "Admins can update projects"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete projects"
  on public.projects for delete
  using (public.is_admin());
