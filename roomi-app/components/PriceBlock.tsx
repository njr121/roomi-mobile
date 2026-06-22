import { View, Text } from "react-native";
import { PriceChangeBadge } from "./PriceChangeBadge";

type PriceBlockProps = {
  normalPrice: number;
  currentPrice: number;
  priceChangeRate: number;
};

export function PriceBlock({ normalPrice, currentPrice, priceChangeRate }: PriceBlockProps) {
  return (
    <View className="flex-row items-center gap-2">
      <PriceChangeBadge rate={priceChangeRate} />
      <View>
        <Text className="text-gray-400 line-through">{normalPrice.toLocaleString()}원</Text>
        <Text className="text-base font-bold">{currentPrice.toLocaleString()}원</Text>
      </View>
    </View>
  );
}
