import { View, Text, Pressable } from "react-native";

type SortValue = "priceChangeRate" | "currentPrice";

type SortSelectorProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: "변동률 낮은순", value: "priceChangeRate" },
  { label: "가격 낮은순", value: "currentPrice" },
];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <View className="flex-row gap-2 px-4 py-2">
      {SORT_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          className={`min-h-11 items-center justify-center rounded-lg border px-3 ${
            value === option.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <Text>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
