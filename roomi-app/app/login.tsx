import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import env from "@/lib/env";
import { loginWithGoogle } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
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

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="mb-8 text-xl font-bold">Roomi 로그인</Text>
      <Pressable
        disabled={!request}
        onPress={() => promptAsync()}
        className="rounded-lg bg-blue-500 px-6 py-3 disabled:opacity-50"
      >
        <Text className="font-semibold text-white">Google로 로그인</Text>
      </Pressable>
      <Text className="mt-4 text-xs text-gray-400">{redirectUri}</Text>
    </View>
  );
}
