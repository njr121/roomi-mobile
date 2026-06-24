import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import type { BottomTabBarProps as RNBottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconSymbol } from "@/components/ui/icon-symbol";

const TABS = [
  { href: "/", label: "Home", icon: "house.fill" as const },
  { href: "/my-bookings", label: "내 예약", icon: "calendar" as const },
  { href: "/wishlist", label: "위시리스트", icon: "heart.fill" as const },
  { href: "/mypage", label: "마이 페이지", icon: "person.fill" as const },
] as const;

const ROUTE_NAME_TO_HREF: Record<string, string> = {
  index: "/",
  "my-bookings": "/my-bookings",
  wishlist: "/wishlist",
  mypage: "/mypage",
};

function TabBarRow({ activeHref }: { activeHref: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t border-gray-200 bg-white pt-1"
      style={{ paddingBottom: insets.bottom + 4 }}
    >
      {TABS.map((tab) => {
        const active = activeHref === tab.href;
        const color = active ? "#0ea5e9" : "#9ca3af";
        return (
          <Pressable
            key={tab.href}
            onPress={() => router.push(tab.href)}
            className="flex-1 items-center gap-0.5"
          >
            <IconSymbol name={tab.icon} size={27} color={color} />
            <Text style={{ color }} className="text-sm">
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// 탭 그룹(`(tabs)`) 바깥의 일반 화면(상세, 검색결과 등)에서 직접 렌더링할 때 사용 — usePathname()으로 현재 경로를 읽음
export function BottomTabBar() {
  const pathname = usePathname();
  return <TabBarRow activeHref={pathname} />;
}

// `<Tabs tabBar={...}>`로 네이티브 탭바를 대체할 때 사용 — usePathname()을 쓰면 전역 경로 구독이 탭 네비게이터 자체의 옵션 갱신과 맞물려 무한 루프가 나서, react-navigation이 직접 주는 state로 활성 탭을 판단함
export function TabsBottomTabBar({ state }: RNBottomTabBarProps) {
  const activeRouteName = state.routes[state.index].name;
  return <TabBarRow activeHref={ROUTE_NAME_TO_HREF[activeRouteName] ?? "/"} />;
}
