import { Pressable } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type BackButtonProps = {
  fallbackHref?: "/";
};

export function BackButton({ fallbackHref = "/" }: BackButtonProps) {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref);
    }
  };

  return (
    <Pressable onPress={goBack} className="h-11 w-11 items-center justify-center">
      <MaterialIcons name="arrow-back" size={24} color="#374151" />
    </Pressable>
  );
}
