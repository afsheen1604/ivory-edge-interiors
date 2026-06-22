-- =============================================================================
-- Ivory Edge Interiors — Migration 0005
-- project_images
-- =============================================================================
--
-- Backs both the "Full image gallery" and the "Before & After section" on the
-- Project Details page. `image_type` distinguishes plain gallery shots from
-- before/after pairs; `pair_group` links one before image to its matching
-- after image so the UI can render them side by side.

create table public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  image_url     text not null,
  image_type    public.project_image_type not null default 'gallery',
  pair_group    uuid,
  caption       text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),

  constraint project_images_pair_group_required check (
    (image_type in ('before', 'after') and pair_group is not null)
    or (image_type = 'gallery' and pair_group is null)
  )
);

comment on table public.project_images is
  'Gallery and before/after images for a project. One row per image.';
comment on column public.project_images.pair_group is
  'Shared UUID linking one "before" image to its matching "after" image. Null for plain gallery images.';

create index project_images_project_id_idx on public.project_images (project_id);
create index project_images_pair_group_idx on public.project_images (pair_group) where pair_group is not null;
create index project_images_display_order_idx on public.project_images (project_id, display_order);

alter table public.project_images enable row level security;

-- Visitors can view images that belong to a published project.
create policy "Public can view images of published projects"
  on public.project_images for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id
        and p.status = 'published'
    )
  );

create policy "Admins can view all project images"
  on public.project_images for select
  using (public.is_admin());

create policy "Admins can insert project images"
  on public.project_images for insert
  with check (public.is_admin());

create policy "Admins can update project images"
  on public.project_images for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete project images"
  on public.project_images for delete
  using (public.is_admin());
