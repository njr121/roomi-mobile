import { View, Text, Pressable } from "react-native";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <View className="flex-row items-center justify-center gap-4 py-4">
      <Pressable
        disabled={page <= 1}
        onPress={onPrev}
        className={`min-h-11 items-center justify-center rounded-lg border border-gray-300 px-4 ${
          page <= 1 ? "opacity-40" : ""
        }`}
      >
        <Text>이전</Text>
      </Pressable>

      <Text>
        {page} / {totalPages || 1}
      </Text>

      <Pressable
        disabled={page >= totalPages}
        onPress={onNext}
        className={`min-h-11 items-center justify-center rounded-lg border border-gray-300 px-4 ${
          page >= totalPages ? "opacity-40" : ""
        }`}
      >
        <Text>다음</Text>
      </Pressable>
    </View>
  );
}
