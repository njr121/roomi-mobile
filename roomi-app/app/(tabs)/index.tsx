import { FlatList, Text, View, Pressable } from "react-native";
import { AccommodationCard } from "@/components/AccommodationCard";
import { WishlistButton } from "@/components/WishlistButton";
import { useAccommodations } from "@/hooks/useAccommodations";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { data, isLoading, isError } = useAccommodations();
  if (isLoading) {
    return <Text>불러오는 중...</Text>;
  }
  if (isError) {
    return <Text>데이터를 불러오지 못했습니다.</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="relative">
          <Link href={`/accommodation/${item.id}`} asChild>
            <Pressable>
              <AccommodationCard accommodation={item} />
            </Pressable>
          </Link>
          <View className="absolute right-1 top-1">
            <WishlistButton accommodationId={item.id} />
          </View>
        </View>
      )}
    />
  );
}
