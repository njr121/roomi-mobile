import { useState } from "react";
import { FlatList, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { AccommodationCard } from "@/components/AccommodationCard";
import { WishlistButton } from "@/components/WishlistButton";
import { SearchBar } from "@/components/SearchBar";
import { FilterSheet } from "@/components/FilterSheet";
import { SortSelector } from "@/components/SortSelector";
import { Pagination } from "@/components/Pagination";
import { useAccommodations } from "@/hooks/useAccommodations";
import { Accommodation, AccommodationFilters } from "@/types";

export default function HomeScreen() {
  const [filters, setFilters] = useState<AccommodationFilters>({
    page: 1,
    sort: "priceChangeRate",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, isError } = useAccommodations(filters);

  return (
    <View className="flex-1">
      <SearchBar
        onSearch={(values) => setFilters((prev) => ({ ...prev, ...values, page: 1 }))}
      />

      <View className="flex-row items-center justify-between px-4">
        <SortSelector
          value={filters.sort ?? "priceChangeRate"}
          onChange={(sort) => setFilters((prev) => ({ ...prev, sort, page: 1 }))}
        />
        <Pressable
          onPress={() => setIsFilterOpen(true)}
          className="min-h-11 items-center justify-center rounded-lg border border-gray-300 px-3"
        >
          <Text>숙박 종류</Text>
        </Pressable>
      </View>

      {isLoading && <Text className="px-4">불러오는 중...</Text>}
      {isError && <Text className="px-4">데이터를 불러오지 못했습니다.</Text>}

      {data && data.data.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text>검색 결과가 없습니다.</Text>
        </View>
      )}

      {data && data.data.length > 0 && (
        <FlatList
          data={data.data}
          keyExtractor={(item: Accommodation) => item.id}
          renderItem={({ item }) => (
            <View className="relative">
              <Link href={`/accommodation/${item.id}`} asChild>
                <Pressable>
                  <AccommodationCard accommodation={item} />
                </Pressable>
              </Link>
              <View className="absolute right-1 top-1">
                <WishlistButton accommodationId={item.id} />
              </View>
            </View>
          )}
        />
      )}

      {data && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPrev={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
          onNext={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
        />
      )}

      <FilterSheet
        visible={isFilterOpen}
        selectedType={filters.type}
        onSelect={(type) => setFilters((prev) => ({ ...prev, type, page: 1 }))}
        onClose={() => setIsFilterOpen(false)}
      />
    </View>
  );
}
