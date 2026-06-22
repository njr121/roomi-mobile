import { useInfiniteQuery } from "@tanstack/react-query";
import { getAccommodations } from "@/lib/api";
import { AccommodationFilters } from "@/types";

export function useAccommodations(filters: AccommodationFilters) {
  return useInfiniteQuery({
    queryKey: ["accommodations", filters],
    queryFn: ({ pageParam }) => getAccommodations({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
