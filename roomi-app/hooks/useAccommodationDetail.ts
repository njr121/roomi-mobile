import { useQuery } from "@tanstack/react-query";
import { getAccommodationDetail } from "@/lib/api";

export function useAccommodationDetail(id: string) {
  return useQuery({
    queryKey: ["accommodation", id],
    queryFn: () => getAccommodationDetail(id),
  });
}
