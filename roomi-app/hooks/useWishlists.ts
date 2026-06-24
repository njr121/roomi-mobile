import { useQuery } from "@tanstack/react-query";
import { getWishlists } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useWishlists() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ["wishlists"],
    queryFn: getWishlists,
    enabled: isLoggedIn,
  });
}
