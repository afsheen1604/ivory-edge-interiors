import { useQuery } from "@tanstack/react-query";
import { getProjects, type ProjectListFilters } from "@/features/projects/services/getProjects";

export function useProjects(filters: ProjectListFilters) {
  return useQuery({
    queryKey: ["projects", "list", filters],
    queryFn: () => getProjects(filters),
  });
}
