import { useRef, useState } from "react";
import { Dimensions, Image, Text, View, Pressable } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PriceChangeBadge } from "./PriceChangeBadge";
import { WishlistButton } from "./WishlistButton";
import { getTypeImage } from "@/lib/typeImages";
import type { Accommodation } from "@/types";

type AccommodationCarouselProps = {
  data: Accommodation[];
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export function AccommodationCarousel({ data }: AccommodationCarouselProps) {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const slideWidth = SCREEN_WIDTH - 32; // px-4 양쪽 패딩 제외

  if (data.length === 0) {
    return null;
  }

  return (
    <View className="mb-2 border-b-8 border-gray-100 pt-2">
      <Text className="mb-2 px-4 text-lg font-bold">베스트 딜</Text>

      <View className="px-4">
        <View
          className="relative overflow-hidden rounded-lg bg-gray-200"
          style={{ height: 192, maxWidth: "100%" }}
        >
          <Carousel
            ref={carouselRef}
            width={slideWidth}
            height={192}
            data={data}
            loop={data.length > 1}
            autoPlay={data.length > 1}
            autoPlayInterval={4000}
            onSnapToItem={setIndex}
            renderItem={({ item }) => (
              <View style={{ width: slideWidth, height: 192 }}>
                <Image
                  source={getTypeImage(item.type, item.id)}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />

                <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-3">
                  <Text className="text-base font-bold text-white">{item.name}</Text>
                  <Text className="mb-1 text-xs text-white/70">{item.location}</Text>
                  <View className="flex-row items-center gap-2">
                    <PriceChangeBadge rate={item.priceChangeRate} />
                    <Text className="text-white/60 line-through">{item.normalPrice.toLocaleString()}원</Text>
                    <Text className="font-bold text-white">{item.currentPrice.toLocaleString()}원</Text>
                  </View>
                </View>

                <Link href={`/accommodation/${item.id}`} asChild>
                  <Pressable style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
                </Link>

                <View className="absolute right-3 top-3">
                  <WishlistButton accommodationId={item.id} />
                </View>
              </View>
            )}
          />

          <Pressable
            onPress={() => carouselRef.current?.prev()}
            className="absolute left-1 top-1/2 -mt-5 h-10 w-10 items-center justify-center rounded-full bg-black/30"
          >
            <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            onPress={() => carouselRef.current?.next()}
            className="absolute right-1 top-1/2 -mt-5 h-10 w-10 items-center justify-center rounded-full bg-black/30"
          >
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
