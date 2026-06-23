-- =============================================================================
-- Ivory Edge Interiors — Migration 0012
-- Storage access policies
-- =============================================================================
--
-- Buckets (created manually via Dashboard → Storage, all marked Public):
--   project-images, project-videos, service-images, company-assets
--
-- "Public bucket" only controls whether a direct file URL is viewable without
-- auth — it does NOT grant upload/update/delete. Those are controlled here,
-- via RLS on storage.objects, scoped per bucket using bucket_id. Same
-- is_admin() helper as the rest of the schema (migration 0003).

-- -----------------------------------------------------------------------------
-- project-images
-- -----------------------------------------------------------------------------
create policy "Public can view project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Admins can upload to project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "Admins can update project-images"
  on storage.objects for update
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "Admins can delete project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- project-videos
-- -----------------------------------------------------------------------------
create policy "Public can view project-videos"
  on storage.objects for select
  using (bucket_id = 'project-videos');

create policy "Admins can upload to project-videos"
  on storage.objects for insert
  with check (bucket_id = 'project-videos' and public.is_admin());

create policy "Admins can update project-videos"
  on storage.objects for update
  using (bucket_id = 'project-videos' and public.is_admin())
  with check (bucket_id = 'project-videos' and public.is_admin());

create policy "Admins can delete project-videos"
  on storage.objects for delete
  using (bucket_id = 'project-videos' and public.is_admin());

-- -----------------------------------------------------------------------------
-- service-images
-- -----------------------------------------------------------------------------
create policy "Public can view service-images"
  on storage.objects for select
  using (bucket_id = 'service-images');

create policy "Admins can upload to service-images"
  on storage.objects for insert
  with check (bucket_id = 'service-images' and public.is_admin());

create policy "Admins can update service-images"
  on storage.objects for update
  using (bucket_id = 'service-images' and public.is_admin())
  with check (bucket_id = 'service-images' and public.is_admin());

create policy "Admins can delete service-images"
  on storage.objects for delete
  using (bucket_id = 'service-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- company-assets
-- -----------------------------------------------------------------------------
create policy "Public can view company-assets"
  on storage.objects for select
  using (bucket_id = 'company-assets');

create policy "Admins can upload to company-assets"
  on storage.objects for insert
  with check (bucket_id = 'company-assets' and public.is_admin());

create policy "Admins can update company-assets"
  on storage.objects for update
  using (bucket_id = 'company-assets' and public.is_admin())
  with check (bucket_id = 'company-assets' and public.is_admin());

create policy "Admins can delete company-assets"
  on storage.objects for delete
  using (bucket_id = 'company-assets' and public.is_admin());
