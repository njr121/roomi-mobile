import { Pressable, Text, Image } from "react-native";

type KakaoButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function KakaoButton({ onPress, disabled, className }: KakaoButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-6 ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Image source={require("@/assets/images/kakao-icon.png")} style={{ width: 20, height: 20 }} resizeMode="contain" />
      <Text className="text-black">Kakao로 시작하기</Text>
    </Pressable>
  );
}
