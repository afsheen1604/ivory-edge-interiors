-- =============================================================================
-- Ivory Edge Interiors — Migration 0009
-- inquiries
-- =============================================================================
--
-- Backs the Contact page form and "Get Free Consultation" / project & service
-- CTAs. Visitors can insert but never read inquiries back — there is no
-- visitor-facing "my submissions" view, so no public SELECT policy exists at
-- all. Only admins can view, search, filter, and manage these.

create table public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text,
  email         text not null,
  message       text not null,
  source        public.inquiry_source not null default 'contact_page',
  project_id    uuid references public.projects(id) on delete set null,
  service_id    uuid references public.services(id) on delete set null,
  status        public.inquiry_status not null default 'new',
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint inquiries_name_not_blank check (length(trim(name)) > 0),
  constraint inquiries_message_not_blank check (length(trim(message)) > 0),
  constraint inquiries_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

comment on table public.inquiries is
  'Contact form and CTA submissions. Visitors can insert; only admins can read, search, or manage.';
comment on column public.inquiries.source is
  'Where the inquiry was submitted from — the general Contact page, or a project/service/home CTA.';
comment on column public.inquiries.status is
  'Admin-managed pipeline: new -> in_progress -> resolved, or archived.';

create index inquiries_status_idx on public.inquiries (status);
create index inquiries_source_idx on public.inquiries (source);
create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_project_id_idx on public.inquiries (project_id);
create index inquiries_service_id_idx on public.inquiries (service_id);

-- Full-text search across name, email, and message, backing the admin
-- Inquiry Management search box.
alter table public.inquiries
  add column search_vector tsvector
    generated always as (
      setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(email, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(message, '')), 'C')
    ) stored;

create index inquiries_search_idx on public.inquiries using gin (search_vector);

create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row
  execute function public.set_updated_at();

alter table public.inquiries enable row level security;

-- Visitors can submit an inquiry. They cannot set status or admin_notes
-- themselves — every new inquiry starts as 'new' with no notes, regardless
-- of what the client sends.
create policy "Public can submit inquiries"
  on public.inquiries for insert
  with check (
    status = 'new'
    and admin_notes is null
  );

-- No public SELECT policy exists — visitors cannot read any inquiry, including
-- their own. This is intentional: there is no "track my inquiry" feature.

create policy "Admins can view all inquiries"
  on public.inquiries for select
  using (public.is_admin());

create policy "Admins can update inquiries"
  on public.inquiries for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete inquiries"
  on public.inquiries for delete
  using (public.is_admin());
