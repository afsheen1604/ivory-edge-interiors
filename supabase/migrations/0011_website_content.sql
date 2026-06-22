-- =============================================================================
-- Ivory Edge Interiors — Migration 0011
-- website_content
-- =============================================================================
--
-- Backs the admin Content Management page: editable Homepage, About Us,
-- Contact Info, and Footer content. Each section has a different shape
-- (Homepage needs hero headline/subheadline, About Us needs mission/vision
-- paragraphs, Contact Info needs phone/email/WhatsApp, Footer needs links),
-- so `content` is jsonb rather than fixed columns — this lets the admin's
-- content editor evolve per section without a schema migration every time a
-- field is added. `section` stays a strict enum so only the four valid
-- sections can ever exist, one row each (enforced by the unique constraint).

create table public.website_content (
  id          uuid primary key default gen_random_uuid(),
  section     public.content_section not null unique,
  content     jsonb not null default '{}'::jsonb,
  updated_by  uuid references public.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.website_content is
  'Editable website content blocks (Home / About Us / Contact Info / Footer), one row per section, edited from the admin Content Management page.';
comment on column public.website_content.content is
  'Section-shaped JSON. E.g. homepage: {"hero_headline": "...", "hero_subheadline": "..."}. contact_info: {"phone": "...", "whatsapp": "...", "email": "..."}.';

create index website_content_section_idx on public.website_content (section);

create trigger website_content_set_updated_at
  before update on public.website_content
  for each row
  execute function public.set_updated_at();

alter table public.website_content enable row level security;

-- Content is public by nature — every visitor needs to read it to render
-- the Home/About/Contact/Footer pages. Only admins can write.
create policy "Public can view website content"
  on public.website_content for select
  using (true);

create policy "Admins can insert website content"
  on public.website_content for insert
  with check (public.is_admin());

create policy "Admins can update website content"
  on public.website_content for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete website content"
  on public.website_content for delete
  using (public.is_admin());
