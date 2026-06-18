import { useQuery } from "@tanstack/react-query";
import { getAccommodations } from "@/lib/api";

export function useAccommodations() {
  return useQuery({
    queryKey: ["accommodations"],
    queryFn: getAccommodations,
  });
}
