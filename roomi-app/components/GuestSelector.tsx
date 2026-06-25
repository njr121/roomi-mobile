import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";

type GuestSelectorProps = {
  max: number;
  value: number | null;
  onChange: (value: number) => void;
};

export function GuestSelector({ max, value, onChange }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <>
      <Pressable className="rounded-lg border border-gray-300 px-3 py-2" onPress={() => setIsOpen(true)}>
        <Text className={value ? "" : "text-gray-400"}>{value ? `${value}명` : "인원 선택"}</Text>
      </Pressable>

      <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setIsOpen(false)}>
          <View className="mt-auto rounded-t-2xl bg-white px-4 py-6">
            <Text className="mb-4 text-lg font-bold">인원 선택</Text>
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`mb-2 min-h-11 items-center justify-center rounded-lg border ${value === option ? "border-sky-500 bg-sky-50" : "border-gray-300"}`}
              >
                <Text>{option}명</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
