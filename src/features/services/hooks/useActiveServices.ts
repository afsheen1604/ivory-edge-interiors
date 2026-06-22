import { useQuery } from "@tanstack/react-query";
import { getActiveServices } from "@/features/services/services/servicesService";

export function useActiveServices() {
  return useQuery({
    queryKey: ["services", "active"],
    queryFn: getActiveServices,
  });
}
