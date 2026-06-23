import { useEffect } from "react";
import { FlatList, Text, View, Pressable, Image, Alert, Platform } from "react-native";
import { router, useRootNavigationState } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMyBookings } from "@/hooks/useMyBookings";
import { useAuthStore } from "@/store/authStore";
import { cancelBooking } from "@/lib/api";
import { BookingWithDetails } from "@/types";
import { getTypeImage } from "@/lib/typeImages";

function BookingRow({ booking }: { booking: BookingWithDetails }) {
  const queryClient = useQueryClient();
  const isCancelled = booking.status === "CANCELLED";

  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const onCancelPress = () => {
    if (Platform.OS === "web") {
      if (window.confirm("예약을 취소하시겠습니까?")) mutate();
      return;
    }
    Alert.alert("예약 취소", "예약을 취소하시겠습니까?", [
      { text: "아니요", style: "cancel" },
      { text: "취소하기", style: "destructive", onPress: () => mutate() },
    ]);
  };

  return (
    <View className="mx-4 mb-4 rounded-lg bg-white shadow-md shadow-black/20">
      <View className="h-36 flex-row overflow-hidden rounded-lg">
        <View className="bg-gray-200" style={{ width: 112, maxWidth: "100%" }}>
          <Image
            source={getTypeImage(booking.room.accommodation.type, booking.room.accommodation.id)}
            resizeMode="cover"
            style={{ maxWidth: "100%", width: "100%", height: "100%" }}
          />
        </View>
        <View className="flex-1 px-3 py-3">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="font-bold">{booking.room.accommodation.name}</Text>
          <View className={`rounded-full px-2 py-0.5 ${isCancelled ? "bg-gray-200" : "bg-sky-100"}`}>
            <Text className={`text-xs font-semibold ${isCancelled ? "text-gray-500" : "text-sky-600"}`}>
              {isCancelled ? "취소됨" : "확정"}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500">{booking.room.name}</Text>
        <Text className="text-sm text-gray-500">
          {booking.checkIn.slice(0, 10)} ~ {booking.checkOut.slice(0, 10)} · {booking.guests}명
        </Text>
        <Text className="mb-2 font-bold">{booking.totalPrice.toLocaleString()}원</Text>

        <Pressable
          disabled={isCancelled || isPending}
          onPress={onCancelPress}
          className={`min-h-9 items-center justify-center rounded-lg ${
            isCancelled || isPending ? "bg-red-300" : "bg-red-500"
          }`}
        >
          <Text className="text-sm font-semibold text-white">{isPending ? "취소 중..." : "예약 취소"}</Text>
        </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function MyBookingsScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data, isLoading, isError } = useMyBookings();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, rootNavigationState?.key]);

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <Text className="px-4">불러오는 중...</Text>;
  }

  if (isError || !data) {
    return <Text className="px-4">데이터를 불러오지 못했습니다.</Text>;
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">아직 예약이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 12 }}
      renderItem={({ item }) => <BookingRow booking={item} />}
    />
  );
}
