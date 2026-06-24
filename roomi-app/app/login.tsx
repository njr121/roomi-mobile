import { useEffect } from "react";
import { View, Text, Alert, Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import env from "@/lib/env";
import { loginWithGoogle } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { GoogleButton } from "@/components/GoogleButton";
import { KakaoButton } from "@/components/KakaoButton";
import { NaverButton } from "@/components/NaverButton";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const insets = useSafeAreaInsets();
  const clientId = Platform.OS === "web" ? env.GOOGLE_CLIENT_ID : env.GOOGLE_ANDROID_CLIENT_ID;
  const redirectUri =
    Platform.OS === "web"
      ? AuthSession.makeRedirectUri()
      : `com.googleusercontent.apps.${env.GOOGLE_ANDROID_CLIENT_ID.split(".apps.googleusercontent.com")[0]}:/oauth2redirect`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type !== "success" || !request?.codeVerifier) return;

    AuthSession.exchangeCodeAsync(
      {
        clientId,
        code: response.params.code,
        redirectUri,
        extraParams: { code_verifier: request.codeVerifier },
      },
      discovery
    )
      .then((tokenResponse) => {
        const idToken = tokenResponse.idToken;
        if (!idToken) throw new Error("Google 토큰 교환 응답에 id_token이 없습니다.");
        return loginWithGoogle(idToken);
      })
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
        <Pressable onPress={() => router.replace("/")} hitSlop={10}>
          <MaterialIcons name="arrow-back" size={26} color="#374151" />
        </Pressable>
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
