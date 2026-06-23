import { supabase } from "@/services/supabase";
import type { Project, ProjectWithCover } from "@/features/projects/types/project";

export interface ProjectListFilters {
  /** Category slug to filter by, or "all" / undefined for every category. */
  category?: Project["category"] | "all";
  /** Free-text search across title, location, and description (uses the projects.search_vector full-text index). */
  search?: string;
}

/**
 * Fetches published projects for the public Projects page grid, with
 * optional category filter and full-text search. RLS (migration 0004)
 * ensures only published rows are returned to an anonymous visitor
 * regardless of what filter is requested here.
 */
export async function getProjects(filters: ProjectListFilters = {}): Promise<ProjectWithCover[]> {
  let query = supabase
    .from("projects")
    .select("id, title, slug, category, cover_image_url, location, is_featured")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const searchTerm = filters.search.trim().replace(/,/g, "\\,");
    const searchPrefix = `${searchTerm}%`;
    const searchWordPrefix = `% ${searchTerm}%`;

    query = query.or(
      `title.ilike.${searchPrefix},title.ilike.${searchWordPrefix},location.ilike.${searchPrefix},location.ilike.${searchWordPrefix}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return data;
}
