import { FlatList, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { useWishlists } from "@/hooks/useWishlists";
import { useAuthStore } from "@/store/authStore";
import { AccommodationCard } from "@/components/AccommodationCard";
import { WishlistButton } from "@/components/WishlistButton";
import { GoogleButton } from "@/components/GoogleButton";

export default function WishlistScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data, isLoading, isError } = useWishlists();

  if (!isLoggedIn) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4">로그인이 필요합니다.</Text>
        <GoogleButton onPress={() => router.push("/login")} />
      </View>
    );
  }

  if (isLoading) {
    return <Text className="px-4">불러오는 중...</Text>;
  }

  if (isError || !data) {
    return <Text className="px-4">데이터를 불러오지 못했습니다.</Text>;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">찜한 숙소가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
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
  );
}
