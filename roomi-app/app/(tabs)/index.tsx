import { FlatList } from "react-native";
import { Accommodation } from "@/types";
import { AccommodationCard } from "@/components/AccommodationCard";

const mockAccommodations: Accommodation[] = [
  { id: "1", name: "서울 신라호텔", type: "hotel", thumbnail: "https://picsum.photos/200", normalPrice: 200000, currentPrice: 260000, priceChangeRate: 30 },
  { id: "2", name: "담양 팬션", type: "pension", thumbnail: "https://picsum.photos/300", normalPrice: 80000, currentPrice: 160000, priceChangeRate: 100 },
  { id: "3", name: "양양 모텔", type: "motel", thumbnail: "https://picsum.photos/400", normalPrice: 60000, currentPrice: 132000, priceChangeRate: 120 },
  { id: "4", name: "부산 리조트", type: "resort", thumbnail: "https://picsum.photos/500", normalPrice: 300000, currentPrice: 330000, priceChangeRate: 10 },
];

export default function HomeScreen() {
  return <FlatList data={mockAccommodations} keyExtractor={(item) => item.id} renderItem={({ item }) => <AccommodationCard accommodation={item} />} />;
}
