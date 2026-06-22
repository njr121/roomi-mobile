import { Image, Text, View } from "react-native";
import { PriceBlock } from "./PriceBlock";
import type { Accommodation } from "@/types";

type AccommodationCardProps = {
  accommodation: Accommodation;
};

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    <View className="mx-4 mb-4 overflow-hidden rounded-lg bg-white">
      <Image source={{ uri: accommodation.images[0] }} className="h-40 w-full bg-gray-200" />
      <View className="px-3 py-2">
        <Text className="font-bold">{accommodation.name}</Text>
        <Text className="mb-1 text-sm text-gray-500">{accommodation.location}</Text>
        <PriceBlock
          normalPrice={accommodation.normalPrice}
          currentPrice={accommodation.currentPrice}
          priceChangeRate={accommodation.priceChangeRate}
        />
      </View>
    </View>
  );
}
