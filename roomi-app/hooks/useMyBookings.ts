import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useMyBookings() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
    enabled: isLoggedIn,
  });
}
