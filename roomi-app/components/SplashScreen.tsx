import { useState } from "react";
import { Image, Text, View } from "react-native";

const BACKGROUND_IMAGES = [
  require("@/assets/images/hotel-1.jpg"),
  require("@/assets/images/hotel-2.jpg"),
  require("@/assets/images/hotel-3.jpg"),
  require("@/assets/images/hotel-4.jpg"),
  require("@/assets/images/motel-1.jpg"),
  require("@/assets/images/motel-2.jpg"),
  require("@/assets/images/motel-3.jpg"),
  require("@/assets/images/motel-4.jpg"),
  require("@/assets/images/pension-2.jpg"),
  require("@/assets/images/pension-3.jpg"),
  require("@/assets/images/pension-4.jpg"),
  require("@/assets/images/resort-1.jpg"),
  require("@/assets/images/resort-2.jpg"),
  require("@/assets/images/resort-3.jpg"),
  require("@/assets/images/resort-4.jpg"),
];

export function SplashScreen() {
  const [background] = useState(
    () => BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]
  );

  return (
    <View className="flex-1 bg-gray-200">
      <Image
        source={background}
        resizeMode="cover"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
      />
      <View className="absolute inset-0 items-center justify-center bg-black/60">
        <Text className="text-4xl font-bold text-white">Roomi</Text>
        <Text className="mt-2 text-sm text-white/90">지금이 가장 합리적인 순간이에요</Text>
      </View>
    </View>
  );
}
