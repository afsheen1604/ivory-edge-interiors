import { supabase } from "@/services/supabase";

/**
 * The four Supabase Storage buckets created in Phase 3. Centralized here so
 * every feature references the same literal bucket names — see
 * docs/DATABASE.md and docs/STORAGE.md for the access policy behind each.
 */
export const STORAGE_BUCKETS = {
  projectImages: "project-images",
  projectVideos: "project-videos",
  serviceImages: "service-images",
  companyAssets: "company-assets",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Uploads a file to the given bucket under an optional folder prefix and
 * returns both the storage path (needed for later delete/replace calls) and
 * the public URL (what gets stored in `cover_image_url`, `image_url`,
 * `video_url`, etc. on the relevant table row).
 *
 * Requires an authenticated admin session — enforced server-side by the
 * Storage RLS policies from migration 0012, not just by this function.
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  folder?: string,
): Promise<UploadResult> {
  const fileExt = file.name.split(".").pop() ?? "bin";
  const randomName = `${crypto.randomUUID()}.${fileExt}`;
  const path = folder ? `${folder}/${randomName}` : randomName;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Failed to upload file to ${bucket}: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

/**
 * Replaces an existing file at the same path (upsert: true), used when an
 * admin swaps a cover image without changing its URL elsewhere.
 */
export async function replaceFile(
  bucket: StorageBucket,
  path: string,
  file: File,
): Promise<UploadResult> {
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) {
    throw new Error(`Failed to replace file in ${bucket}: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

/**
 * Deletes one or more files from a bucket by their storage path (not their
 * public URL). Requires an authenticated admin session, enforced by RLS.
 */
export async function deleteFiles(bucket: StorageBucket, paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw new Error(`Failed to delete file(s) from ${bucket}: ${error.message}`);
  }
}

/**
 * Extracts the storage path from a Supabase public URL, so admin UIs that
 * only have the stored `image_url`/`video_url` can still delete the
 * underlying file when a row is removed.
 */
export function extractStoragePath(publicUrl: string, bucket: StorageBucket): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}
