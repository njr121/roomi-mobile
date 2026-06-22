import { Pressable, Text, Image } from "react-native";

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
      <Image source={require("@/assets/images/google-icon.png")} style={{ width: 20, height: 20 }} resizeMode="contain" />
      <Text className="text-gray-700">Google로 시작하기</Text>
    </Pressable>
  );
}
