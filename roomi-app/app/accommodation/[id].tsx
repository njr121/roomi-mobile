import { ScrollView, Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useAccommodationDetail } from "@/hooks/useAccommodationDetail";
import { PriceChangeBadge } from "@/components/PriceChangeBadge";

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
      <Text>{data.name}</Text>
      <Text>{data.location}</Text>
      <Text className="line-through">{data.normalPrice}원</Text>
      <Text>{data.currentPrice}원</Text>
      <PriceChangeBadge rate={data.priceChangeRate} />
      <Text>{data.description}</Text>
      <Text>평점 {data.rating}</Text>

      {data.rooms.map((room) => (
        <Text key={room.id}>
          {room.name} · {room.price}원 · 최대 {room.maxGuests}명
        </Text>
      ))}
    </ScrollView>
  );
}
