import { ScrollView, Text, View, Pressable, Image } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAccommodationDetail } from "@/hooks/useAccommodationDetail";
import { PriceBlock } from "@/components/PriceBlock";
import { WishlistButton } from "@/components/WishlistButton";
import { getTypeImage } from "@/lib/typeImages";

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
    <ScrollView className="bg-white">
      <Stack.Screen options={{ title: data.name }} />

      <View className="bg-gray-200" style={{ height: 224, maxWidth: "100%" }}>
        <Image
          source={getTypeImage(data.type, data.id)}
          resizeMode="cover"
          style={{ maxWidth: "100%", width: "100%", height: "100%" }}
        />
      </View>

      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold">{data.name}</Text>
          <WishlistButton accommodationId={data.id} />
        </View>
        <Text className="mb-1 text-sm text-gray-500">{data.location}</Text>
        <View className="mb-2 flex-row items-center gap-1">
          <MaterialIcons name="star" size={16} color="#facc15" />
          <Text className="text-sm font-semibold text-gray-700">{data.rating.toFixed(1)}</Text>
        </View>

        <PriceBlock
          normalPrice={data.normalPrice}
          currentPrice={data.currentPrice}
          priceChangeRate={data.priceChangeRate}
        />
        <Text className="mt-3 text-gray-700">{data.description}</Text>

        <Text className="mb-2 mt-5 text-lg font-bold">객실 선택</Text>
        {data.rooms.map((room) => (
          <Pressable
            key={room.id}
            className="mb-3 flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-md shadow-black/20"
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
            <View>
              <Text className="font-bold">{room.name}</Text>
              <Text className="text-sm text-gray-500">최대 {room.maxGuests}명</Text>
              <Text className="mt-1 font-bold">{room.price.toLocaleString()}원</Text>
            </View>
            <Text className="font-semibold text-sky-500">예약하기</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
