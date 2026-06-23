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
      className={`min-h-14 flex-row items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-6 ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Image source={require("@/assets/images/kakao-icon.png")} style={{ width: 26, height: 26 }} resizeMode="contain" />
      <Text className="text-lg text-black">Kakao로 시작하기</Text>
    </Pressable>
  );
}
