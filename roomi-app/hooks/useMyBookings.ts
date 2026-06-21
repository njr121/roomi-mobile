import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/api";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
}
