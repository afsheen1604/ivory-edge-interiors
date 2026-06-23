import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReviews, addAdminReply, deleteReview } from "@/features/admin/services/adminService";

export function useAllReviews() {
  return useQuery({
    queryKey: ["admin", "reviews", "all"],
    queryFn: () => getAllReviews(),
  });
}

export function useAddAdminReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      addAdminReply(reviewId, reply),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "reviews", "all"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "reviews", "all"] });
    },
  });
}
