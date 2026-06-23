-- =============================================================================
-- Ivory Edge Interiors — Migration 0010
-- instagram_posts
-- =============================================================================
--
-- Backs the public Instagram Gallery page and Home page Instagram Showcase
-- section. Fully admin-curated — admin pastes a post/reel URL and picks the
-- type; there is no live Instagram API integration.

create table public.instagram_posts (
  id            uuid primary key default gen_random_uuid(),
  type          public.instagram_content_type not null,
  url           text not null,
  thumbnail_url text,
  caption       text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint instagram_posts_url_not_blank check (length(trim(url)) > 0)
);

comment on table public.instagram_posts is
  'Admin-curated Instagram post/reel links shown on the public Instagram Gallery and Home page showcase.';
comment on column public.instagram_posts.is_active is
  'Soft toggle to hide a post from the public site without deleting it.';

create index instagram_posts_display_order_idx on public.instagram_posts (display_order);
create index instagram_posts_active_idx on public.instagram_posts (is_active) where is_active = true;
create index instagram_posts_type_idx on public.instagram_posts (type);

create trigger instagram_posts_set_updated_at
  before update on public.instagram_posts
  for each row
  execute function public.set_updated_at();

alter table public.instagram_posts enable row level security;

create policy "Public can view active instagram posts"
  on public.instagram_posts for select
  using (is_active = true);

create policy "Admins can view all instagram posts"
  on public.instagram_posts for select
  using (public.is_admin());

create policy "Admins can insert instagram posts"
  on public.instagram_posts for insert
  with check (public.is_admin());

create policy "Admins can update instagram posts"
  on public.instagram_posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete instagram posts"
  on public.instagram_posts for delete
  using (public.is_admin());
