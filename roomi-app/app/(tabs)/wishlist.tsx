import { useEffect, useRef } from "react";
import { FlatList, Text, View, Pressable } from "react-native";
import { Link, router, useRootNavigationState } from "expo-router";
import { useWishlists } from "@/hooks/useWishlists";
import { useAuthStore } from "@/store/authStore";
import { AccommodationCard } from "@/components/AccommodationCard";
import { WishlistButton } from "@/components/WishlistButton";
import { ScrollJumpButtons } from "@/components/ScrollJumpButtons";
import { AppHeader } from "@/components/AppHeader";

export default function WishlistScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const { data, isLoading, isError } = useWishlists();
  const rootNavigationState = useRootNavigationState();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (isRestoring) return;
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, isRestoring, rootNavigationState?.key]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View className="flex-1">
      <AppHeader variant="title" title="위시리스트" showBack />
      {isLoading && <Text className="px-4">불러오는 중...</Text>}
      {!isLoading && (isError || !data) && <Text className="px-4">데이터를 불러오지 못했습니다.</Text>}
      {!isLoading && data && data.length === 0 && (
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-gray-400">위시리스트가 비어있습니다.</Text>
        </View>
      )}
      {!isLoading && data && data.length > 0 && (
        <>
          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 12 }}
            renderItem={({ item }) => (
              <View className="relative mb-4 w-[48%]">
                <Link href={`/accommodation/${item.accommodationId}`} asChild>
                  <Pressable>
                    <AccommodationCard accommodation={item.accommodation} variant="grid" />
                  </Pressable>
                </Link>
                <View className="absolute right-3 top-3">
                  <WishlistButton accommodationId={item.accommodationId} />
                </View>
              </View>
            )}
          />
          <ScrollJumpButtons
            onScrollToTop={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
            onScrollToBottom={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        </>
      )}
    </View>
  );
}
