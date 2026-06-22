import { useQuery } from "@tanstack/react-query";
import { getRecentInquiries, getRecentReviews, type ReviewRow, type InquiryRow } from "@/features/admin/services/adminService";

export function useRecentReviews() {
  return useQuery<ReviewRow[]>({
    queryKey: ["admin", "recent", "reviews"],
    queryFn: () => getRecentReviews(6),
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useRecentInquiries() {
  return useQuery<InquiryRow[]>({
    queryKey: ["admin", "recent", "inquiries"],
    queryFn: () => getRecentInquiries(6),
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export default useRecentReviews;
