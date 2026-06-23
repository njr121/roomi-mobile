import { useMemo, useRef, useState } from "react";
import { FlatList, Text, View, Pressable, Modal } from "react-native";
import { Link, router } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import { AccommodationCard } from "@/components/AccommodationCard";
import { AccommodationCarousel } from "@/components/AccommodationCarousel";
import { WishlistButton } from "@/components/WishlistButton";
import { SearchBar } from "@/components/SearchBar";
import { CategoryIcons } from "@/components/CategoryIcons";
import { SortSelector } from "@/components/SortSelector";
import { ScrollJumpButtons } from "@/components/ScrollJumpButtons";
import { useAccommodations } from "@/hooks/useAccommodations";
import { Accommodation, AccommodationFilters } from "@/types";

export default function HomeScreen() {
  const [filters, setFilters] = useState<AccommodationFilters>({
    sort: "currentPrice",
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const listRef = useRef<FlatList>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAccommodations(filters);

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const { data: bestDealsData } = useAccommodations({ sort: "priceChangeRate" });
  const bestDeals = useMemo(
    () => bestDealsData?.pages[0]?.data.slice(0, 6) ?? [],
    [bestDealsData]
  );
  const carouselElement = useMemo(() => <AccommodationCarousel data={bestDeals} />, [bestDeals]);

  return (
    <View className="flex-1">
      <AppHeader variant="search" onSearchPress={() => setIsSearchOpen(true)} />

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
          data={items}
          keyExtractor={(item: Accommodation) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
          ListHeaderComponent={
            <View>
              {carouselElement}
              <CategoryIcons
                selectedType={filters.type}
                onSelect={(type) => setFilters((prev) => ({ ...prev, type }))}
              />
              <SortSelector
                value={filters.sort ?? "currentPrice"}
                onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
              />
            </View>
          }
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
          onScrollToTop={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          onScrollToBottom={() => listRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <Modal visible={isSearchOpen} animationType="slide">
        <View className="flex-1 bg-white pt-3">
          <Pressable onPress={() => setIsSearchOpen(false)} className="self-start px-4 pb-2">
            <Text className="text-2xl text-gray-600">✕</Text>
          </Pressable>
          <SearchBar
            onSearch={(values) => {
              setIsSearchOpen(false);
              router.push({
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
      </Modal>
    </View>
  );
}
