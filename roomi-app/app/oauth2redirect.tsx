import { View } from "react-native";

// 구글 로그인 콜백이 잠깐 거쳐가는 화면 — 곧바로 login.tsx의 인증 처리로 넘어가므로 빈 화면만 보여준다
export default function OAuthRedirectScreen() {
  return <View className="flex-1 bg-white" />;
}
