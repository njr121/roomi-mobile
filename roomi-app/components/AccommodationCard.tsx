import { Image, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PriceBlock } from "./PriceBlock";
import { getTypeImage } from "@/lib/typeImages";
import type { Accommodation } from "@/types";

type AccommodationCardProps = {
  accommodation: Accommodation;
  variant?: "list" | "carousel" | "grid";
};

export function AccommodationCard({ accommodation, variant = "list" }: AccommodationCardProps) {
  const outerClass = variant === "grid" ? "w-full" : variant === "list" ? "mx-4 mb-4" : "w-full";
  const imageHeight = variant === "grid" ? 112 : 160;

  return (
    <View className={`${outerClass} rounded-lg bg-white shadow-md shadow-black/40`}>
      <View className="overflow-hidden rounded-lg">
        <View className="bg-gray-200" style={{ height: imageHeight, maxWidth: "100%" }}>
          <Image
            source={getTypeImage(accommodation.type, accommodation.id)}
            resizeMode="cover"
            style={{ maxWidth: "100%", width: "100%", height: "100%" }}
          />
        </View>
        <View className="px-3 py-2">
          <Text className="font-bold">{accommodation.name}</Text>
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">{accommodation.location}</Text>
            <View className="flex-row items-center gap-0.5">
              <MaterialIcons name="star" size={14} color="#facc15" />
              <Text className="text-xs font-semibold text-gray-700">{accommodation.rating.toFixed(1)}</Text>
            </View>
          </View>
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
