import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ScrollJumpButtonsProps = {
  onScrollToTop: () => void;
  onScrollToBottom: () => void;
  bottomOffset?: number;
};

export function ScrollJumpButtons({
  onScrollToTop,
  onScrollToBottom,
  bottomOffset = 16,
}: ScrollJumpButtonsProps) {
  return (
    <View className="absolute right-4 gap-2" style={{ bottom: bottomOffset }}>
      <Pressable
        onPress={onScrollToTop}
        className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
      >
        <MaterialIcons name="keyboard-arrow-up" size={26} color="#ffffff" />
      </Pressable>
      <Pressable
        onPress={onScrollToBottom}
        className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
      >
        <MaterialIcons name="keyboard-arrow-down" size={26} color="#ffffff" />
      </Pressable>
    </View>
  );
}
