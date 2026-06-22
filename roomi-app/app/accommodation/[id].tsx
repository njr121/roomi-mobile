import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useAccommodationDetail } from "@/hooks/useAccommodationDetail";
import { PriceBlock } from "@/components/PriceBlock";
import { WishlistButton } from "@/components/WishlistButton";

export default function AccommodationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useAccommodationDetail(id);

  if (isLoading) {
    return <Text>불러오는 중...</Text>;
  }

  if (isError || !data) {
    return <Text>데이터를 불러오지 못했습니다.</Text>;
  }

  return (
    <ScrollView className="px-4 py-4">
      <Stack.Screen options={{ title: data.name }} />
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">{data.name}</Text>
        <WishlistButton accommodationId={data.id} />
      </View>
      <Text className="mb-2 text-sm text-gray-500">{data.location}</Text>
      <PriceBlock
        normalPrice={data.normalPrice}
        currentPrice={data.currentPrice}
        priceChangeRate={data.priceChangeRate}
      />
      <Text className="mt-3 text-gray-700">{data.description}</Text>
      <Text className="mb-2 mt-1 text-gray-500">평점 {data.rating}</Text>

      {data.rooms.map((room) => (
        <Pressable
          key={room.id}
          className="min-h-11 flex-row items-center justify-between border-b border-gray-200 px-4 py-3"
          onPress={() =>
            router.push({
              pathname: "/booking/[roomId]",
              params: {
                roomId: room.id,
                roomName: room.name,
                price: String(room.price),
                maxGuests: String(room.maxGuests),
              },
            })
          }
        >
          <Text>
            {room.name} · {room.price}원 · 최대 {room.maxGuests}명
          </Text>
          <Text className="text-blue-500">예약하기</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
