import { FlatList, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMyBookings } from "@/hooks/useMyBookings";
import { useAuthStore } from "@/store/authStore";
import { cancelBooking } from "@/lib/api";
import { BookingWithDetails } from "@/types";

function BookingRow({ booking }: { booking: BookingWithDetails }) {
  const queryClient = useQueryClient();
  const isCancelled = booking.status === "CANCELLED";

  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return (
    <View className="border-b border-gray-200 px-4 py-3">
      <Text className="font-bold">{booking.room.accommodation.name}</Text>
      <Text>{booking.room.name}</Text>
      <Text>
        {booking.checkIn.slice(0, 10)} ~ {booking.checkOut.slice(0, 10)} · {booking.guests}명
      </Text>
      <Text>{booking.totalPrice.toLocaleString()}원</Text>
      <Text>상태: {isCancelled ? "취소됨" : booking.status}</Text>

      <Pressable
        disabled={isCancelled || isPending}
        onPress={() => mutate()}
        className={`mt-2 min-h-11 items-center justify-center rounded-lg ${
          isCancelled || isPending ? "bg-red-300" : "bg-red-500"
        }`}
      >
        <Text className="font-semibold text-white">{isPending ? "취소 중..." : "예약 취소"}</Text>
      </Pressable>
    </View>
  );
}

export default function MyBookingsScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data, isLoading, isError } = useMyBookings();

  if (!isLoggedIn) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4">로그인이 필요합니다.</Text>
        <Pressable
          onPress={() => router.push("/login")}
          className="min-h-11 items-center justify-center rounded-lg bg-blue-500 px-6"
        >
          <Text className="font-semibold text-white">로그인하기</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading) {
    return <Text>불러오는 중...</Text>;
  }

  if (isError || !data) {
    return <Text>데이터를 불러오지 못했습니다.</Text>;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>아직 예약이 없습니다.</Text>
      </View>
    );
  }

  return <FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <BookingRow booking={item} />} />;
}
