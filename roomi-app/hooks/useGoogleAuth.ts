import { useEffect } from "react";
import { Platform } from "react-native";
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

const isWeb = Platform.OS === "web";

// 웹 클라이언트("웹 애플리케이션" 타입)는 토큰 교환 시 client_secret을 요구해서
// 프론트엔드에서 직접 교환할 수 없다. 대신 웹은 시크릿이 필요 없는 암묵적 흐름(id_token)을 쓰고,
// 시크릿이 없는 게 정책상 막혀있는 네이티브(Android) 쪽만 Authorization Code + PKCE를 쓴다.
// 웹은 구글이 항상 사이트 루트로 리디렉션하기 때문에, 이 훅을 로그인 화면이 아니라
// 루트 레이아웃에서 호출해야 어느 화면에 있다가 돌아와도 응답을 처리할 수 있다.
export function useGoogleAuth() {
  const login = useAuthStore((state) => state.login);
  const setGoogleAuth = useAuthStore((state) => state.setGoogleAuth);
  const clientId = isWeb ? env.GOOGLE_CLIENT_ID : env.GOOGLE_ANDROID_CLIENT_ID;
  const redirectUri = isWeb
    ? AuthSession.makeRedirectUri()
    : `com.googleusercontent.apps.${env.GOOGLE_ANDROID_CLIENT_ID.split(".apps.googleusercontent.com")[0]}:/oauth2redirect`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    isWeb
      ? {
          clientId,
          scopes: ["openid", "profile", "email"],
          redirectUri,
          responseType: AuthSession.ResponseType.IdToken,
          extraParams: { nonce: "roomi-login-nonce" },
          usePKCE: false,
        }
      : {
          clientId,
          scopes: ["openid", "profile", "email"],
          redirectUri,
          responseType: AuthSession.ResponseType.Code,
          usePKCE: true,
        },
    discovery
  );

  useEffect(() => {
    setGoogleAuth(!!request, () => promptAsync());
  }, [request, promptAsync, setGoogleAuth]);

  useEffect(() => {
    if (response?.type !== "success") return;

    if (isWeb) {
      const idToken = response.params.id_token;
      loginWithGoogle(idToken)
        .then(({ token, user }) => login(token, user))
        .then(() => router.replace("/"));
      return;
    }

    if (!request?.codeVerifier) return;

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
}
