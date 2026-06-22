import { Pressable, Text, Image } from "react-native";

type NaverButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function NaverButton({ onPress, disabled, className }: NaverButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-lg bg-[#03C75A] px-6 ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Image source={require("@/assets/images/naver-icon.png")} style={{ width: 20, height: 20 }} resizeMode="contain" />
      <Text className="text-white">Naver로 시작하기</Text>
    </Pressable>
  );
}
