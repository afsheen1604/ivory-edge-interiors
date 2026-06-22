# Storage

Phase 3 deliverable. Covers the 4 Supabase Storage buckets, their access
policies, and the shared upload helpers used by every feature.

## Buckets

| Bucket            | Public | Used for                                                |
| ------------------ | ------ | -------------------------------------------------------- |
| `project-images`   | Yes    | `project_images.image_url`, `projects.cover_image_url`  |
| `project-videos`   | Yes    | `project_videos.video_url` (uploaded videos only)       |
| `service-images`   | Yes    | `services.image_url`                                    |
| `company-assets`   | Yes    | Logo, founder photo, OG image, and other site-wide assets |

Created manually via Dashboard → Storage → New bucket (no SQL creates a
bucket; only its access policies are code).

## Access policies (migration 0012)

"Public bucket" only controls whether a direct file URL is viewable without
authentication — it does **not** grant upload/update/delete. Those are
controlled by RLS policies on `storage.objects`, scoped per bucket via
`bucket_id`, using the same `public.is_admin()` helper as every database
table:

- **Anyone** can `SELECT` (view/download) objects in any of the 4 buckets.
- **Only admins** can `INSERT` (upload), `UPDATE` (replace), or `DELETE`.

This was verified live: an anonymous upload attempt to `project-images`
was rejected with a row-level security violation.

## Upload helpers

`src/features/storage/uploadHelpers.ts` is the single place every feature
goes through to talk to Storage — `features/projects/services`,
`features/services/services`, etc. all import from here rather than calling
`supabase.storage` directly. This keeps bucket names, public-URL
construction, and error handling consistent everywhere.

```ts
import { uploadFile, replaceFile, deleteFiles, STORAGE_BUCKETS } from "@/features/storage/uploadHelpers";

// Upload a new project cover image
const { path, publicUrl } = await uploadFile(STORAGE_BUCKETS.projectImages, file, "covers");
// -> store `publicUrl` in projects.cover_image_url, keep `path` if you'll need to delete/replace later

// Replace an existing file at the same path
await replaceFile(STORAGE_BUCKETS.projectImages, path, newFile);

// Delete files (e.g. when a project is deleted, clean up its images)
await deleteFiles(STORAGE_BUCKETS.projectImages, [path]);
```

All four functions require an authenticated admin session to succeed — that
requirement is enforced by the Storage RLS policies themselves, not by this
helper, so even a direct API call without the helper is equally protected.

## Folder convention

Within each bucket, files are organized by purpose using a folder prefix
passed as the third argument to `uploadFile`, e.g.:

```
project-images/
  covers/<uuid>.jpg
  gallery/<uuid>.jpg
  before-after/<uuid>.jpg
service-images/
  <uuid>.jpg
company-assets/
  logo/<uuid>.svg
  founder/<uuid>.jpg
```

Filenames are always a random UUID + original extension — never the
user's original filename — to avoid collisions and avoid leaking
potentially sensitive original filenames.
