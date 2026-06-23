import { supabase } from "@/services/supabase";
import type { ProjectWithCover } from "@/features/projects/types/project";

/**
 * Fetches featured, published projects for the Home page "Featured Projects"
 * section. RLS (migration 0004) ensures only published rows are returned to
 * an anonymous visitor regardless of what filter is requested here.
 */
export async function getFeaturedProjects(limit = 6): Promise<ProjectWithCover[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, slug, category, cover_image_url, location, is_featured")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load featured projects: ${error.message}`);
  }

  return data;
}
