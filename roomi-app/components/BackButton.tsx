import { Pressable } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type BackButtonProps = {
  fallbackHref?: "/";
  size?: number;
};

export function BackButton({ fallbackHref = "/", size = 24 }: BackButtonProps) {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref);
    }
  };

  return (
    <Pressable onPress={goBack} hitSlop={10}>
      <MaterialIcons name="arrow-back" size={size} color="#374151" />
    </Pressable>
  );
}
