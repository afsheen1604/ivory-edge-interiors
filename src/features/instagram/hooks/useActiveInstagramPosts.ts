import { useQuery } from "@tanstack/react-query";
import { getActiveInstagramPosts } from "@/features/instagram/services/instagramService";

export function useActiveInstagramPosts(limit?: number) {
  return useQuery({
    queryKey: ["instagram", "active", limit],
    queryFn: () => getActiveInstagramPosts(limit),
  });
}
