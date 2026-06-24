import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BackButton } from "./BackButton";

export const APP_HEADER_HEIGHT = 64;

type AppHeaderProps =
  | { variant: "search"; onSearchPress: () => void }
  | { variant: "title"; title: string; showBack?: boolean };

// 모든 화면(탭 4개 + 상세·검색결과·예약·로그인)이 공통으로 쓰는 헤더 — 높이를 하나로 고정해서 화면마다 헤더 키가 달라지는 문제를 없앰
export function AppHeader(props: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center border-b border-gray-200 bg-white px-4"
      style={{ height: APP_HEADER_HEIGHT + insets.top, paddingTop: insets.top }}
    >
      {props.variant === "search" ? (
        <>
          <Pressable onPress={() => router.push("/")}>
            <Text className="text-3xl font-bold text-sky-500">Roomi</Text>
          </Pressable>
          <Pressable
            onPress={props.onSearchPress}
            className="ml-3 h-14 flex-1 flex-row items-center justify-between rounded-lg border border-gray-300 px-3"
          >
            <Text className="text-lg text-gray-400">어디로 가시나요?</Text>
            <MaterialIcons name="search" size={24} color="#9ca3af" />
          </Pressable>
        </>
      ) : (
        <>
          {props.showBack && <BackButton size={26} />}
          <Text
            className={`flex-1 text-lg font-semibold ${props.showBack ? "ml-3" : ""}`}
            numberOfLines={1}
          >
            {props.title}
          </Text>
        </>
      )}
    </View>
  );
}
