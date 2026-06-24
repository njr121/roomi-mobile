import { View, Text, Pressable } from "react-native";
import { Accommodation } from "@/types";

type AccommodationType = Accommodation["type"];

const CATEGORIES: { label: string; icon: string; value: AccommodationType | undefined }[] = [
  { label: "전체", icon: "🛏️", value: undefined },
  { label: "호텔", icon: "🏨", value: "hotel" },
  { label: "모텔", icon: "🏩", value: "motel" },
  { label: "펜션", icon: "🏡", value: "pension" },
  { label: "리조트", icon: "🏖", value: "resort" },
];

type CategoryIconsProps = {
  selectedType: AccommodationType | undefined;
  onSelect: (type: AccommodationType | undefined) => void;
};

export function CategoryIcons({ selectedType, onSelect }: CategoryIconsProps) {
  return (
    <View className="flex-row justify-between px-4 py-2">
      {CATEGORIES.map((category) => (
        <Pressable
          key={category.label}
          onPress={() => onSelect(category.value)}
          className="items-center"
        >
          <View className="mb-1 h-11 w-11 items-center justify-center rounded-full">
            <Text className="text-xl">{category.icon}</Text>
          </View>
          <Text
            className={`text-xs font-bold ${selectedType === category.value ? "text-sky-500" : "text-gray-700"}`}
          >
            {category.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
