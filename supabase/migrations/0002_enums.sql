-- =============================================================================
-- Ivory Edge Interiors — Migration 0002
-- Enum types
-- =============================================================================

-- Role 1: visitor (implicit — no row, no auth account)
-- Role 2: admin   (explicit — row in public.users, linked to auth.users)
create type public.user_role as enum (
  'admin'
);

-- Mirrors the five services listed in the brief. Used by `projects.category`
-- so every project is filed under exactly one of the published service lines.
create type public.project_category as enum (
  'residential_interiors',
  'commercial_interiors',
  'turnkey_solutions',
  'space_planning',
  'furniture_decor_styling'
);

create type public.project_status as enum (
  'draft',
  'published',
  'archived'
);

-- A gallery image can be a normal gallery shot or part of a before/after pair.
create type public.project_image_type as enum (
  'gallery',
  'before',
  'after'
);

-- Admin explicitly picks one of these per video (brief: "Admin chooses: Video Type").
create type public.video_source_type as enum (
  'upload',
  'youtube',
  'vimeo',
  'instagram_reel'
);

create type public.review_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type public.inquiry_status as enum (
  'new',
  'in_progress',
  'resolved',
  'archived'
);

-- Inquiries can originate from the general Contact page or from a
-- project/service-specific "Get Free Consultation" / "Inquire" CTA.
create type public.inquiry_source as enum (
  'contact_page',
  'project_cta',
  'service_cta',
  'home_cta'
);

create type public.instagram_content_type as enum (
  'post',
  'reel'
);

-- Keys for the editable website_content table (Home / About / Contact / Footer).
create type public.content_section as enum (
  'homepage',
  'about_us',
  'contact_info',
  'footer'
);
