# Database Schema

Phase 2 deliverable. All SQL lives in `supabase/migrations/`, applied in order
(0001 → 0011) via the Supabase Dashboard SQL Editor. This document is the
human-readable reference for what's in the database and why.

## Tables overview

| Table              | Purpose                                                        | Public read           | Public write |
| ------------------ | ---------------------------------------------------------------| ---------------------- | ------------ |
| `users`             | Admin profiles, 1:1 with `auth.users`                          | No                     | No           |
| `projects`          | Portfolio entries                                               | Published only         | No           |
| `project_images`    | Gallery + before/after images per project                       | Of published projects  | No           |
| `project_videos`    | Uploaded or external (YouTube/Vimeo/Reel) videos per project    | Of published projects  | No           |
| `services`           | The 5 service offerings                                         | Active only             | No           |
| `reviews`            | Visitor-submitted, admin-moderated reviews                       | Approved only           | Insert only (forced `pending`) |
| `inquiries`          | Contact form + CTA submissions                                  | None — admin only        | Insert only (forced `new`) |
| `instagram_posts`    | Admin-curated Instagram post/reel links                          | Active only              | No           |
| `website_content`    | Editable Home / About / Contact / Footer content blocks          | All                       | No           |

Every table has Row Level Security (RLS) **enabled**. The split above is
enforced entirely at the database level via RLS policies — the frontend
never has to re-implement these rules; even a malicious direct API call
hits the same wall.

## Roles

- **Visitor** — the anonymous Supabase `anon` role. No login, no row in
  `users`. Gets read access to public-facing content and insert-only access
  to `reviews` and `inquiries`.
- **Admin** — an authenticated user with a row in `public.users` where
  `role = 'admin'` and `is_active = true`. Verified via the `public.is_admin()`
  helper function (`SECURITY DEFINER`, used in every admin-write policy).
  Gets full CRUD on every table.

There is no public sign-up. Admin accounts are provisioned manually via the
Supabase Auth admin API/dashboard in Phase 4 (Authentication) — someone with
project access creates the auth user, then inserts a matching row into
`public.users`.

## Key design decisions

**Enums over free-text strings.** `project_category`, `project_status`,
`video_source_type`, `review_status`, `inquiry_status`, `inquiry_source`,
`instagram_content_type`, `content_section`, `project_image_type` are all
Postgres enums. This means an invalid category or status is rejected by the
database itself, not just by frontend validation — defense in depth.

**`project_videos` source consistency.** The brief requires the admin to
explicitly choose Upload vs External URL per video. A `CHECK` constraint
(`project_videos_source_consistency`) enforces that an `upload` row has
`video_url` set and `external_url` null, while a `youtube`/`vimeo`/
`instagram_reel` row has `external_url` set and `video_url` null — so the
two fields can never both be populated or both be empty.

**Before/after images via `pair_group`.** Rather than a separate table,
`project_images.image_type` (`gallery` | `before` | `after`) plus a shared
`pair_group` UUID links one "before" shot to its matching "after" shot. A
`CHECK` constraint requires `pair_group` to be set for before/after rows and
null for plain gallery rows.

**Reviews and inquiries can't fake their own status.** Both tables'
insert policies use `with check` clauses that force `status` to its default
(`pending` for reviews, `new` for inquiries) and admin-only fields
(`admin_reply`/`replied_at`, `admin_notes`) to `null` — verified live by
attempting to insert a pre-approved review as the `anon` role, which Postgres
rejected with a row-level security violation.

**`inquiries` has no public SELECT policy at all.** Visitors can submit an
inquiry but can never read it back — not even their own. There's no
"track my inquiry" feature in the brief, so the safer default is no read
access whatsoever, confirmed by `anon` getting zero rows on a direct `SELECT`.

**`website_content` is `jsonb`-shaped per section.** Homepage, About Us,
Contact Info, and Footer each need a different set of fields. Rather than
adding columns every time a new field is needed, `content` is a single
`jsonb` column per section row, with `section` as a strict enum + unique
constraint so exactly one row can exist per section. Example shapes:

```jsonc
// section = 'homepage'
{ "hero_headline": "Where Elegance Meets Comfort", "hero_subheadline": "..." }

// section = 'contact_info'
{ "phone": "+91 80089 71115", "whatsapp": "+91 80089 71115", "email": "ivoryedgeinteriors@gmail.com" }
```

**Full-text search.** `projects.search_vector` and `inquiries.search_vector`
are `tsvector` columns, generated automatically (`GENERATED ALWAYS AS ...
STORED`) from the relevant text fields, backed by `GIN` indexes. This powers
the Projects page search box and the admin Inquiry Management search box
without needing an external search service.

**`updated_at` auto-maintenance.** A single shared trigger function,
`public.set_updated_at()`, is attached to every table with an `updated_at`
column. No application code ever needs to set this field manually.

## Entity relationships

```
auth.users (Supabase Auth)
   │ 1:1
   ▼
users (admin profiles)
   │ created_by / updated_by
   ▼
projects ──┬──< project_images (image_type: gallery | before/after pair_group)
           ├──< project_videos (video_type: upload | youtube | vimeo | instagram_reel)
           ├──< reviews (optional project_id)
           └──< inquiries (optional project_id)

services ──< inquiries (optional service_id)

instagram_posts        (standalone, admin-curated)
website_content         (standalone, one row per content_section)
```

## Provisioning the first admin (preview — full steps land in Phase 4)

1. In Supabase Dashboard → Authentication → Users, create a new user with
   the founder's email (manually, or via "Invite").
2. Copy that user's `id` (UUID).
3. Insert a matching profile row:
   ```sql
   insert into public.users (id, email, full_name, role)
   values ('<copied-uuid>', 'ivoryedgeinteriors@gmail.com', 'Shaik Riyaz Ahmed', 'admin');
   ```
4. That account can now log in and will pass `public.is_admin()` checks
   everywhere.

This document will be expanded in Phase 4 with the actual login flow and
session handling.
