import { Text, View } from "react-native";

type PriceChangeBadgeProps = {
  rate: number;
};

export function PriceChangeBadge({ rate }: PriceChangeBadgeProps) {
  let bgColor = "bg-green-500";
  if (rate >= 100) {
    bgColor = "bg-red-500";
  } else if (rate >= 30) {
    bgColor = "bg-orange-500";
  }

  return (
    <View className={bgColor}>
      <Text>{`+${rate}%`}</Text>
    </View>
  );
}
