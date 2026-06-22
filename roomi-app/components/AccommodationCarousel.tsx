import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PriceChangeBadge } from "./PriceChangeBadge";
import { WishlistButton } from "./WishlistButton";
import type { Accommodation } from "@/types";

type AccommodationCarouselProps = {
  data: Accommodation[];
};

export function AccommodationCarousel({ data }: AccommodationCarouselProps) {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (data.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data.length]);

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [index]);

  if (data.length === 0) {
    return null;
  }

  const goPrev = () => setIndex((prev) => (prev - 1 + data.length) % data.length);
  const goNext = () => setIndex((prev) => (prev + 1) % data.length);
  const current = data[index];

  return (
    <View className="mb-2 border-b-8 border-gray-100 pt-2">
      <Text className="mb-2 px-4 text-lg font-bold">베스트 딜</Text>

      <View className="px-4">
      <View className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200">
        <Animated.View style={{ flex: 1, opacity }}>
          <Link href={`/accommodation/${current.id}`} asChild>
            <Pressable style={{ flex: 1 }}>
              <Image source={{ uri: current.images[0] }} className="h-full w-full" />
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
                <Text className="text-base font-bold text-white">{current.name}</Text>
                <Text className="mb-1 text-xs text-white/70">{current.location}</Text>
                <View className="flex-row items-center gap-2">
                  <PriceChangeBadge rate={current.priceChangeRate} />
                  <Text className="text-white/60 line-through">{current.normalPrice.toLocaleString()}원</Text>
                  <Text className="font-bold text-white">{current.currentPrice.toLocaleString()}원</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        </Animated.View>

        <View className="absolute right-3 top-3">
          <WishlistButton accommodationId={current.id} />
        </View>

        <Pressable onPress={goPrev} className="absolute left-1 top-1/2 -mt-5 h-10 w-10 items-center justify-center rounded-full bg-black/30">
          <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
        </Pressable>
        <Pressable onPress={goNext} className="absolute right-1 top-1/2 -mt-5 h-10 w-10 items-center justify-center rounded-full bg-black/30">
          <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
        </Pressable>

        <View className="absolute bottom-2 right-3 rounded-full bg-black/40 px-2 py-0.5">
          <Text className="text-xs text-white">
            {index + 1} / {data.length}
          </Text>
        </View>
      </View>
      </View>
    </View>
  );
}
