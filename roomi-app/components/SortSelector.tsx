import { View, Text, Pressable } from "react-native";

type SortValue = "priceChangeRate" | "currentPrice" | "rating";

type SortSelectorProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "가격 낮은순", value: "currentPrice" },
  { label: "변동률 낮은순", value: "priceChangeRate" },
  { label: "평점 높은순", value: "rating" },
];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <View className="flex-row gap-4 px-4 pt-4 pb-2">
      {SORT_OPTIONS.map((option) => (
        <Pressable key={option.value} onPress={() => onChange(option.value)} className="py-1">
          <Text className={`text-base font-bold ${value === option.value ? "text-black" : "text-gray-500"}`}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
