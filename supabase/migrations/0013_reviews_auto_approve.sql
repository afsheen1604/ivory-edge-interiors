-- =============================================================================
-- Ivory Edge Interiors — Migration 0013
-- Remove review status column — reviews appear immediately
-- Admins can still reply and delete reviews
-- =============================================================================

-- Drop status column and its enum type
alter table public.reviews drop column if exists status;

-- Drop the review_status enum (no longer needed)
drop type if exists public.review_status;

-- Drop old RLS policies that checked status
drop policy if exists "Public can view approved reviews" on public.reviews;
drop policy if exists "Public can submit reviews" on public.reviews;

-- New simple RLS policies:
-- Anyone can view all reviews
create policy "Public can view all reviews"
  on public.reviews for select
  using (true);

-- Anyone can submit a review
create policy "Public can submit reviews"
  on public.reviews for insert
  with check (
    admin_reply is null
    and replied_at is null
  );

-- Admins can view all reviews
create policy "Admins can view all reviews"
  on public.reviews for select
  using (public.is_admin());

-- Admins can update reviews (to add reply)
create policy "Admins can update reviews"
  on public.reviews for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete reviews
create policy "Admins can delete reviews"
  on public.reviews for delete
  using (public.is_admin());
