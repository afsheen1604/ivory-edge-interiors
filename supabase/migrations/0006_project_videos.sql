-- =============================================================================
-- Ivory Edge Interiors — Migration 0006
-- project_videos
-- =============================================================================
--
-- Brief requirement: "Admin chooses: Video Type — Upload Video / External URL"
-- with external sources limited to YouTube, Vimeo, Instagram Reel.
-- video_url    -> populated when video_type = 'upload' (Supabase Storage path)
-- external_url -> populated when video_type is youtube/vimeo/instagram_reel
-- Exactly one of the two is set, enforced by a CHECK constraint, so the UI
-- never has to guess which field is authoritative.

create table public.project_videos (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  video_type    public.video_source_type not null,
  video_url     text,
  external_url  text,
  thumbnail_url text,
  title         text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),

  constraint project_videos_source_consistency check (
    (video_type = 'upload' and video_url is not null and external_url is null)
    or
    (video_type in ('youtube', 'vimeo', 'instagram_reel') and external_url is not null and video_url is null)
  )
);

comment on table public.project_videos is
  'Project video gallery. Each row is either an uploaded file (Supabase Storage) or an external link (YouTube/Vimeo/Instagram Reel) — never both.';
comment on column public.project_videos.video_url is
  'Supabase Storage path/URL, populated only when video_type = upload.';
comment on column public.project_videos.external_url is
  'Full external link, populated only when video_type is youtube, vimeo, or instagram_reel.';

create index project_videos_project_id_idx on public.project_videos (project_id);
create index project_videos_display_order_idx on public.project_videos (project_id, display_order);

alter table public.project_videos enable row level security;

create policy "Public can view videos of published projects"
  on public.project_videos for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_videos.project_id
        and p.status = 'published'
    )
  );

create policy "Admins can view all project videos"
  on public.project_videos for select
  using (public.is_admin());

create policy "Admins can insert project videos"
  on public.project_videos for insert
  with check (public.is_admin());

create policy "Admins can update project videos"
  on public.project_videos for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete project videos"
  on public.project_videos for delete
  using (public.is_admin());
