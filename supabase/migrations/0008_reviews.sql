-- =============================================================================
-- Ivory Edge Interiors — Migration 0008
-- reviews
-- =============================================================================
--
-- Visitor-submitted reviews (Reviews page form + optional Project Details
-- page submission). Every review starts as 'pending' — never directly
-- visible — until an admin approves it. Admins can also reply, which shows
-- as a public response under the review once approved.

create table public.reviews (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references public.projects(id) on delete set null,
  reviewer_name text not null,
  rating        smallint not null,
  review_text   text not null,
  status        public.review_status not null default 'pending',
  admin_reply   text,
  replied_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint reviews_rating_range check (rating >= 1 and rating <= 5),
  constraint reviews_reviewer_name_not_blank check (length(trim(reviewer_name)) > 0),
  constraint reviews_text_not_blank check (length(trim(review_text)) > 0)
);

comment on table public.reviews is
  'Visitor-submitted reviews. project_id is optional — a review can be general or tied to a specific project.';
comment on column public.reviews.status is
  'pending = awaiting admin moderation (default on submit). approved = visible publicly. rejected = hidden, retained for records.';
comment on column public.reviews.admin_reply is
  'Optional public reply from the admin, shown alongside the review once set.';

create index reviews_project_id_idx on public.reviews (project_id);
create index reviews_status_idx on public.reviews (status);
create index reviews_created_at_idx on public.reviews (created_at desc);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

alter table public.reviews enable row level security;

-- Visitors can view only approved reviews.
create policy "Public can view approved reviews"
  on public.reviews for select
  using (status = 'approved');

-- Visitors can submit a review. They cannot set status, admin_reply, or
-- replied_at themselves — the with check clause forces every new review to
-- start as 'pending' with no reply, regardless of what the client sends.
create policy "Public can submit reviews"
  on public.reviews for insert
  with check (
    status = 'pending'
    and admin_reply is null
    and replied_at is null
  );

create policy "Admins can view all reviews"
  on public.reviews for select
  using (public.is_admin());

create policy "Admins can update reviews"
  on public.reviews for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete reviews"
  on public.reviews for delete
  using (public.is_admin());
