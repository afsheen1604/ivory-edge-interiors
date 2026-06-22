import { supabase } from "@/services/supabase";
import type { Project, ProjectImage, ProjectVideo, ProjectWithCover } from "@/features/projects/types/project";

export interface ProjectDetail extends Project {
  project_images: ProjectImage[];
  project_videos: ProjectVideo[];
}

/**
 * Fetches a single published project by its slug, with all gallery images
 * and videos nested. Returns null if no published project matches — the
 * page renders a "project not found" state rather than an error in that
 * case, since an invalid/old slug is an expected, not exceptional,
 * situation (e.g. a shared link to an archived project).
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*), project_videos(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load project: ${error.message}`);
  }

  if (!data) return null;

  const project = data as Project & {
    project_images: ProjectImage[];
    project_videos: ProjectVideo[];
  };

  return {
    ...project,
    project_images: [...project.project_images].sort((a, b) => a.display_order - b.display_order),
    project_videos: [...project.project_videos].sort((a, b) => a.display_order - b.display_order),
  };
}

/**
 * Fetches other published projects in the same category, excluding the
 * current one, for the "Related Projects" section.
 */
export async function getRelatedProjects(
  category: Project["category"],
  excludeProjectId: string,
  limit = 3,
): Promise<ProjectWithCover[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, slug, category, cover_image_url, location, is_featured")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", excludeProjectId)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load related projects: ${error.message}`);
  }

  return data;
}
