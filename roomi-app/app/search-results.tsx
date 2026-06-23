import { FlatList, Text, View, Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AccommodationCard } from "@/components/AccommodationCard";
import { WishlistButton } from "@/components/WishlistButton";
import { SortSelector } from "@/components/SortSelector";
import { BottomTabBar } from "@/components/BottomTabBar";
import { ScrollJumpButtons } from "@/components/ScrollJumpButtons";
import { useAccommodations } from "@/hooks/useAccommodations";
import { Accommodation, AccommodationFilters } from "@/types";

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{
    region?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>();

  const [sort, setSort] = useState<AccommodationFilters["sort"]>("currentPrice");

  const filters: AccommodationFilters = {
    region: params.region || undefined,
    checkIn: params.checkIn || undefined,
    checkOut: params.checkOut || undefined,
    guests: params.guests ? Number(params.guests) : undefined,
    sort,
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAccommodations(filters);

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const listRef = useRef<FlatList>(null);

  return (
    <View className="flex-1 bg-white">
      <AppHeader variant="title" title="검색 결과" showBack />

      <SortSelector value={sort ?? "currentPrice"} onChange={setSort} />

      {isLoading && <Text className="px-4">불러오는 중...</Text>}
      {isError && <Text className="px-4">데이터를 불러오지 못했습니다.</Text>}

      {!isLoading && items.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text>검색 결과가 없습니다.</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={items}
          keyExtractor={(item: Accommodation) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <Text className="py-4 text-center text-gray-400">불러오는 중...</Text> : null
          }
          renderItem={({ item }) => (
            <View className="relative mb-4 w-[48%]">
              <Link href={`/accommodation/${item.id}`} asChild>
                <Pressable>
                  <AccommodationCard accommodation={item} variant="grid" />
                </Pressable>
              </Link>
              <View className="absolute right-3 top-3">
                <WishlistButton accommodationId={item.id} />
              </View>
            </View>
          )}
        />
      )}
      {items.length > 0 && (
        <ScrollJumpButtons
          bottomOffset={76}
          onScrollToTop={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          onScrollToBottom={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}
      <BottomTabBar />
    </View>
  );
}
