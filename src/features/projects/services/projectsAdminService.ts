import { supabase } from "@/services/supabase";
import {
  uploadProjectCoverImage,
  uploadProjectImageFile,
  uploadProjectVideoFile,
  uploadProjectVideoThumbnail,
  deleteProjectImageUrl,
  deleteProjectVideoUrl,
} from "@/features/storage/storageService";
import type { Database, ProjectCategory, ProjectStatus } from "@/types/database.types";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];
export type ProjectVideoRow = Database["public"]["Tables"]["project_videos"]["Row"];

export type ProjectWithMedia = ProjectRow & {
  project_images: ProjectImageRow[];
  project_videos: ProjectVideoRow[];
};

export async function getAdminProjects(): Promise<ProjectRow[]> {
  const res = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (res.error) throw res.error;
  return res.data ?? [];
}

export async function getAdminProject(id: string): Promise<ProjectRow | null> {
  const res = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (res.error) throw res.error;
  return res.data ?? null;
}

export async function getAdminProjectWithMedia(id: string): Promise<ProjectWithMedia | null> {
  const res = await supabase
    .from("projects")
    .select("*, project_images(*), project_videos(*)")
    .eq("id", id)
    .maybeSingle();

  if (res.error) throw res.error;
  return res.data ?? null;
}

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  location?: string | null;
  completion_date?: string | null;
  status?: ProjectStatus;
  is_featured?: boolean;
  coverImageFile?: File | null;
}

export async function createAdminProject(input: CreateProjectInput): Promise<ProjectRow> {
  let cover_image_url: string | null = null;

  if (input.coverImageFile) {
    const { publicUrl } = await uploadProjectCoverImage(input.coverImageFile);
    cover_image_url = publicUrl;
  }

  const res = await supabase
    .from("projects")
    .insert([
      {
        title: input.title,
        slug: input.slug,
        description: input.description,
        category: input.category,
        location: input.location ?? null,
        completion_date: input.completion_date ?? null,
        cover_image_url,
        status: input.status ?? "draft",
        is_featured: input.is_featured ?? false,
      },
    ])
    .select()
    .maybeSingle();

  if (res.error) throw res.error;
  if (!res.data) throw new Error("Failed to create project");
  return res.data;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

export async function updateAdminProject(input: UpdateProjectInput): Promise<ProjectRow> {
  let cover_image_url: string | null | undefined = input.coverImageFile ? null : undefined;

  if (input.coverImageFile) {
    const currentCoverRes = await supabase.from("projects").select("cover_image_url").eq("id", input.id).maybeSingle();
    if (currentCoverRes.error) throw currentCoverRes.error;

    const { publicUrl } = await uploadProjectCoverImage(input.coverImageFile);
    cover_image_url = publicUrl;

    if (currentCoverRes.data?.cover_image_url) {
      await deleteProjectImageUrl(currentCoverRes.data.cover_image_url);
    }
  }

  type AllowedProjectUpdate = Partial<Pick<ProjectRow, "title" | "slug" | "description" | "category" | "location" | "completion_date" | "cover_image_url" | "status" | "is_featured">>;

  const updatePayload: AllowedProjectUpdate = {
    ...(input.title ? { title: input.title } : {}),
    ...(input.slug ? { slug: input.slug } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.category ? { category: input.category } : {}),
    location: input.location === undefined ? undefined : input.location ?? null,
    completion_date: input.completion_date === undefined ? undefined : input.completion_date ?? null,
    ...(cover_image_url !== undefined ? { cover_image_url } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(typeof input.is_featured === "boolean" ? { is_featured: input.is_featured } : {}),
  };

  const res = await supabase.from("projects").update(updatePayload).eq("id", input.id).select().maybeSingle();

  if (res.error) throw res.error;
  if (!res.data) throw new Error("Failed to update project");
  return res.data;
}

export interface CreateProjectImageInput {
  project_id: string;
  imageFile: File;
  image_type: Database["public"]["Tables"]["project_images"]["Row"]["image_type"];
  pair_group?: string | null;
  caption?: string | null;
  display_order?: number;
}

export async function createAdminProjectImage(input: CreateProjectImageInput): Promise<ProjectImageRow> {
  const { publicUrl } = await uploadProjectImageFile(input.imageFile);

  const res = await supabase
    .from("project_images")
    .insert([
      {
        project_id: input.project_id,
        image_url: publicUrl,
        image_type: input.image_type,
        pair_group: input.image_type === "gallery" ? null : input.pair_group ?? crypto.randomUUID(),
        caption: input.caption ?? null,
        display_order: input.display_order ?? 0,
      },
    ])
    .select()
    .maybeSingle();

  if (res.error) throw res.error;
  if (!res.data) throw new Error("Failed to create project image");
  return res.data;
}

export async function deleteAdminProjectImage(id: string): Promise<void> {
  const rowRes = await supabase.from("project_images").select("image_url").eq("id", id).maybeSingle();
  if (rowRes.error) throw rowRes.error;

  if (rowRes.data?.image_url) {
    await deleteProjectImageUrl(rowRes.data.image_url);
  }

  const { error } = await supabase.from("project_images").delete().eq("id", id);
  if (error) throw error;
}

export interface CreateProjectVideoInput {
  project_id: string;
  video_type: Database["public"]["Tables"]["project_videos"]["Row"]["video_type"];
  videoFile?: File | null;
  external_url?: string | null;
  thumbnailFile?: File | null;
  title?: string | null;
  display_order?: number;
}

export async function createAdminProjectVideo(input: CreateProjectVideoInput): Promise<ProjectVideoRow> {
  let video_url: string | null = null;
  let external_url: string | null = null;
  let thumbnail_url: string | null = null;

  if (input.video_type === "upload") {
    if (!input.videoFile) {
      throw new Error("Video file is required for upload videos");
    }

    const uploadResult = await uploadProjectVideoFile(input.videoFile);
    video_url = uploadResult.publicUrl;
    external_url = null;

    if (input.thumbnailFile) {
      const thumbnailResult = await uploadProjectVideoThumbnail(input.thumbnailFile);
      thumbnail_url = thumbnailResult.publicUrl;
    }
  } else {
    if (!input.external_url) {
      throw new Error("External URL is required for non-upload videos");
    }

    video_url = null;
    external_url = input.external_url;
    thumbnail_url = null;
  }

  const res = await supabase
    .from("project_videos")
    .insert([
      {
        project_id: input.project_id,
        video_type: input.video_type,
        video_url,
        external_url,
        thumbnail_url,
        title: input.title ?? null,
        display_order: input.display_order ?? 0,
      },
    ])
    .select()
    .maybeSingle();

  if (res.error) throw res.error;
  if (!res.data) throw new Error("Failed to create project video");
  return res.data;
}

export async function deleteAdminProjectVideo(id: string): Promise<void> {
  const rowRes = await supabase
    .from("project_videos")
    .select("video_url, thumbnail_url")
    .eq("id", id)
    .maybeSingle();

  if (rowRes.error) throw rowRes.error;

  if (rowRes.data?.video_url) {
    await deleteProjectVideoUrl(rowRes.data.video_url);
  }

  if (rowRes.data?.thumbnail_url) {
    await deleteProjectImageUrl(rowRes.data.thumbnail_url);
  }

  const { error } = await supabase.from("project_videos").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteAdminProject(id: string): Promise<void> {
  const projectRes = await supabase.from("projects").select("cover_image_url").eq("id", id).maybeSingle();
  if (projectRes.error) throw projectRes.error;

  const imagesRes = await supabase.from("project_images").select("image_url").eq("project_id", id);
  const videosRes = await supabase.from("project_videos").select("video_url, thumbnail_url").eq("project_id", id);

  if (imagesRes.error) throw imagesRes.error;
  if (videosRes.error) throw videosRes.error;

  if (projectRes.data?.cover_image_url) {
    await deleteProjectImageUrl(projectRes.data.cover_image_url);
  }

  await Promise.all(
    (imagesRes.data ?? [])
      .filter((row): row is Pick<ProjectImageRow, "image_url"> => Boolean(row.image_url))
      .map((row) => deleteProjectImageUrl(row.image_url)),
  );

  await Promise.all(
    (videosRes.data ?? []).map(async (row) => {
      if (row.video_url) {
        await deleteProjectVideoUrl(row.video_url);
      }
      if (row.thumbnail_url) {
        await deleteProjectImageUrl(row.thumbnail_url);
      }
    }),
  );

  await supabase.from("project_images").delete().eq("project_id", id);
  await supabase.from("project_videos").delete().eq("project_id", id);

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
