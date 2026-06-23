import { useQuery } from "@tanstack/react-query";
import { getDashboardCounts, type DashboardCounts } from "@/features/admin/services/adminService";

export function useDashboardStats() {
  return useQuery<DashboardCounts>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getDashboardCounts,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export default useDashboardStats;
