import { GestureResponderEvent, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useWishlists } from "@/hooks/useWishlists";
import { useAuthStore } from "@/store/authStore";
import { addWishlist, removeWishlist } from "@/lib/api";

type WishlistButtonProps = {
  accommodationId: string;
};

export function WishlistButton({ accommodationId }: WishlistButtonProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();
  const { data } = useWishlists();
  const isWishlisted = isLoggedIn && (data?.some((item) => item.accommodationId === accommodationId) ?? false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        await removeWishlist(accommodationId);
      } else {
        await addWishlist(accommodationId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });

  const onPress = (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    mutate();
  };

  return (
    <Pressable onPress={onPress} disabled={isPending} className="h-11 w-11 items-center justify-center">
      <MaterialIcons
        name={isWishlisted ? "favorite" : "favorite-border"}
        size={26}
        color={isWishlisted ? "#ef4444" : "#9ca3af"}
      />
    </Pressable>
  );
}
