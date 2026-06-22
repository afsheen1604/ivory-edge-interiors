import { useQuery } from "@tanstack/react-query";
import { getApprovedReviews } from "@/features/reviews/services/reviewsService";

export function useApprovedReviews(limit?: number) {
  return useQuery({
    queryKey: ["reviews", "approved", limit],
    queryFn: () => getApprovedReviews(limit),
  });
}
