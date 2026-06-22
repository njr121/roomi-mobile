import { View, Text, Pressable, Modal } from "react-native";
import { Accommodation } from "@/types";

type AccommodationType = Accommodation["type"];

const TYPE_OPTIONS: { label: string; value: AccommodationType | undefined }[] = [
  { label: "전체", value: undefined },
  { label: "호텔", value: "hotel" },
  { label: "모텔", value: "motel" },
  { label: "펜션", value: "pension" },
  { label: "리조트", value: "resort" },
];

type FilterSheetProps = {
  visible: boolean;
  selectedType: AccommodationType | undefined;
  onSelect: (type: AccommodationType | undefined) => void;
  onClose: () => void;
};

export function FilterSheet({ visible, selectedType, onSelect, onClose }: FilterSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="mt-auto rounded-t-2xl bg-white px-4 py-6">
          <Text className="mb-4 text-lg font-bold">숙박 종류</Text>
          {TYPE_OPTIONS.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              className={`mb-2 min-h-11 items-center justify-center rounded-lg border ${
                selectedType === option.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <Text>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
