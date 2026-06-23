import { useEffect } from "react";
import { View, Text, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import env from "@/lib/env";
import { loginWithGoogle } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { GoogleButton } from "@/components/GoogleButton";
import { KakaoButton } from "@/components/KakaoButton";
import { NaverButton } from "@/components/NaverButton";
import { BackButton } from "@/components/BackButton";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const insets = useSafeAreaInsets();
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: env.GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: { nonce: "roomi-login-nonce" },
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type !== "success") return;

    const idToken = response.params.id_token;

    loginWithGoogle(idToken)
      .then(({ token, user }) => login(token, user))
      .then(() => router.replace("/"));
  }, [response]);

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
        <BackButton size={26} />
      </View>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="mb-8 text-3xl font-bold text-sky-500">Roomi 로그인</Text>
        <View className="w-full gap-3">
          <GoogleButton disabled={!request} onPress={() => promptAsync()} />
          <KakaoButton onPress={() => showComingSoon("Kakao")} />
          <NaverButton onPress={() => showComingSoon("Naver")} />
        </View>
      </View>
    </View>
  );
}
