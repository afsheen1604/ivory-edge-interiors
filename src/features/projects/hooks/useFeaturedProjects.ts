import { useQuery } from "@tanstack/react-query";
import { getFeaturedProjects } from "@/features/projects/services/projectsService";

export function useFeaturedProjects(limit = 6) {
  return useQuery({
    queryKey: ["projects", "featured", limit],
    queryFn: () => getFeaturedProjects(limit),
  });
}
