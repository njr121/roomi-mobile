import { FlatList, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { useWishlists } from "@/hooks/useWishlists";
import { useAuthStore } from "@/store/authStore";
import { PriceBlock } from "@/components/PriceBlock";
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
    return <Text>불러오는 중...</Text>;
  }

  if (isError || !data) {
    return <Text>데이터를 불러오지 못했습니다.</Text>;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>찜한 숙소가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="relative">
          <Link href={`/accommodation/${item.accommodationId}`} asChild>
            <Pressable className="min-h-11 border-b border-gray-200 px-4 py-3">
              <Text className="font-bold">{item.accommodation.name}</Text>
              <Text className="mb-1 text-sm text-gray-500">{item.accommodation.location}</Text>
              <PriceBlock
                normalPrice={item.accommodation.normalPrice}
                currentPrice={item.accommodation.currentPrice}
                priceChangeRate={item.accommodation.priceChangeRate}
              />
            </Pressable>
          </Link>
          <View className="absolute right-2 top-2">
            <WishlistButton accommodationId={item.accommodationId} />
          </View>
        </View>
      )}
    />
  );
}
