import { useQuery } from "@tanstack/react-query";
import {
  getProjectBySlug,
  getRelatedProjects,
} from "@/features/projects/services/getProjectDetail";
import type { Project } from "@/features/projects/types/project";

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["projects", "detail", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: slug.length > 0,
  });
}

export function useRelatedProjects(category: Project["category"] | undefined, excludeId: string | undefined) {
  return useQuery({
    queryKey: ["projects", "related", category, excludeId],
    queryFn: () => getRelatedProjects(category!, excludeId!),
    enabled: Boolean(category) && Boolean(excludeId),
  });
}
