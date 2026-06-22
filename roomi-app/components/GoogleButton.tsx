import { Pressable, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type GoogleButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function GoogleButton({ onPress, disabled, className }: GoogleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <FontAwesome5 name="google" size={16} color="#4285F4" />
      <Text className="font-semibold text-gray-700">Google 로그인</Text>
    </Pressable>
  );
}
