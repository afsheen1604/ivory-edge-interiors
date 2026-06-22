import { useQuery } from "@tanstack/react-query";
import { getApprovedReviewsForProject } from "@/features/reviews/services/reviewsService";

export function useProjectReviews(projectId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", "project", projectId],
    queryFn: () => getApprovedReviewsForProject(projectId!),
    enabled: Boolean(projectId),
  });
}
