import { useQuery } from "@tanstack/react-query";
import { getAccommodations } from "@/lib/api";
import { AccommodationFilters } from "@/types";

export function useAccommodations(filters: AccommodationFilters) {
  return useQuery({
    queryKey: ["accommodations", filters],
    queryFn: () => getAccommodations(filters),
  });
}
