import { Image, Text, View } from "react-native";
import { PriceChangeBadge } from "./PriceChangeBadge";
import type { Accommodation } from "@/types";

type AccommodationCardProps = {
  accommodation: Accommodation;
};

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    <View className="">
      <Image source={{ uri: accommodation.images[0] }} />
      <Text className="">{accommodation.name}</Text>
      <Text className="line-through">{accommodation.normalPrice}원</Text>
      <Text className="">{accommodation.currentPrice}원</Text>
      <PriceChangeBadge rate={accommodation.priceChangeRate} />
    </View>
  );
}
