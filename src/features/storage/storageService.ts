import {
  deleteFiles,
  extractStoragePath,
  replaceFile,
  STORAGE_BUCKETS,
  uploadFile,
  type StorageBucket,
  type UploadResult,
} from "./uploadHelpers";

export async function uploadProjectCoverImage(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.projectImages, file, "projects");
}

export async function replaceProjectCoverImage(path: string, file: File): Promise<UploadResult> {
  return replaceFile(STORAGE_BUCKETS.projectImages, path, file);
}

export async function uploadProjectImageFile(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.projectImages, file, "projects/images");
}

export async function uploadProjectVideoFile(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.projectVideos, file, "projects/videos");
}

export async function uploadProjectVideoThumbnail(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.projectImages, file, "projects/video-thumbnails");
}

export async function uploadServiceImage(file: File): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.serviceImages, file, "services");
}

export async function uploadCompanyAsset(file: File, folder: string): Promise<UploadResult> {
  return uploadFile(STORAGE_BUCKETS.companyAssets, file, folder);
}

async function deleteStorageUrl(publicUrl: string, bucket: StorageBucket): Promise<void> {
  const path = extractStoragePath(publicUrl, bucket);
  if (!path) return;
  await deleteFiles(bucket, [path]);
}

export async function deleteProjectImageUrl(publicUrl: string): Promise<void> {
  await deleteStorageUrl(publicUrl, STORAGE_BUCKETS.projectImages);
}

export async function deleteProjectVideoUrl(publicUrl: string): Promise<void> {
  await deleteStorageUrl(publicUrl, STORAGE_BUCKETS.projectVideos);
}

export async function deleteServiceImageUrl(publicUrl: string): Promise<void> {
  await deleteStorageUrl(publicUrl, STORAGE_BUCKETS.serviceImages);
}

export async function deleteCompanyAssetUrl(publicUrl: string): Promise<void> {
  await deleteStorageUrl(publicUrl, STORAGE_BUCKETS.companyAssets);
}
