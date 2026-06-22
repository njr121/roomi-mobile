import { Image, Text, View } from "react-native";
import { PriceBlock } from "./PriceBlock";
import type { Accommodation } from "@/types";

type AccommodationCardProps = {
  accommodation: Accommodation;
  variant?: "list" | "carousel" | "grid";
};

export function AccommodationCard({ accommodation, variant = "list" }: AccommodationCardProps) {
  const outerClass = variant === "grid" ? "w-full" : variant === "list" ? "mx-4 mb-4" : "w-full";
  const imageHeightClass = variant === "grid" ? "h-28" : "h-40";

  return (
    <View className={`${outerClass} rounded-lg bg-white shadow-md shadow-black/20`}>
      <View className="overflow-hidden rounded-lg">
        <Image source={{ uri: accommodation.images[0] }} className={`${imageHeightClass} w-full bg-gray-200`} />
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
    </View>
  );
}
