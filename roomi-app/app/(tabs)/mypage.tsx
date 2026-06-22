import { View, Text, Pressable, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function MyPageScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!isLoggedIn) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4">로그인이 필요합니다.</Text>
        <Pressable
          onPress={() => router.push("/login")}
          className="min-h-11 items-center justify-center rounded-lg bg-blue-500 px-6"
        >
          <Text className="font-semibold text-white">로그인하기</Text>
        </Pressable>
      </View>
    );
  }

  const doLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const onLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        doLogout();
      }
      return;
    }

    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: doLogout },
    ]);
  };

  return (
    <View className="flex-1 px-6 py-6">
      <Text className="mb-1 text-xl font-bold">{user?.name ?? "사용자"}</Text>
      <Text className="mb-8 text-gray-500">{user?.email}</Text>

      <Pressable
        onPress={onLogout}
        className="min-h-11 items-center justify-center rounded-lg border border-red-500"
      >
        <Text className="font-semibold text-red-500">로그아웃</Text>
      </Pressable>
    </View>
  );
}
