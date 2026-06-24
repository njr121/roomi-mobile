import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SearchBar } from "@/components/SearchBar";

export default function SearchModalScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <Pressable onPress={() => router.back()} className="self-start px-4 pb-2">
        <Text className="text-2xl text-gray-600">✕</Text>
      </Pressable>
      <SearchBar
        onSearch={(values) => {
          router.replace({
            pathname: "/search-results",
            params: {
              region: values.region ?? "",
              checkIn: values.checkIn ?? "",
              checkOut: values.checkOut ?? "",
              guests: values.guests ? String(values.guests) : "",
            },
          });
        }}
      />
    </View>
  );
}
