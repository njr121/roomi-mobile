import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useAccommodationDetail } from "@/hooks/useAccommodationDetail";
import { PriceChangeBadge } from "@/components/PriceChangeBadge";
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
    <ScrollView>
      <Stack.Screen options={{ title: data.name }} />
      <View className="flex-row items-center justify-between">
        <Text>{data.name}</Text>
        <WishlistButton accommodationId={data.id} />
      </View>
      <Text>{data.location}</Text>
      <Text className="line-through">{data.normalPrice}원</Text>
      <Text>{data.currentPrice}원</Text>
      <PriceChangeBadge rate={data.priceChangeRate} />
      <Text>{data.description}</Text>
      <Text>평점 {data.rating}</Text>

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
