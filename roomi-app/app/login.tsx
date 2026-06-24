import { View, Text, Alert, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthStore } from "@/store/authStore";
import { GoogleButton } from "@/components/GoogleButton";
import { KakaoButton } from "@/components/KakaoButton";
import { NaverButton } from "@/components/NaverButton";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const googleAuthReady = useAuthStore((state) => state.googleAuthReady);
  const promptGoogleLogin = useAuthStore((state) => state.promptGoogleLogin);

  const showComingSoon = (provider: string) => {
    const message = `${provider} 로그인은 아직 준비 중입니다.`;
    if (Platform.OS === "web") {
      window.alert(message);
      return;
    }
    Alert.alert("준비 중", message);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute left-4 z-10" style={{ top: insets.top + 16 }}>
        <Pressable onPress={() => router.replace("/")} hitSlop={10}>
          <MaterialIcons name="arrow-back" size={26} color="#374151" />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="mb-8 text-3xl font-bold text-sky-500">Roomi 로그인</Text>
        <View className="w-full gap-3">
          <GoogleButton disabled={!googleAuthReady} onPress={() => promptGoogleLogin()} />
          <KakaoButton onPress={() => showComingSoon("Kakao")} />
          <NaverButton onPress={() => showComingSoon("Naver")} />
        </View>
      </View>
    </View>
  );
}
