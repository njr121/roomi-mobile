import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DateData } from "react-native-calendars";
import { createBooking } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const GuestsFormSchema = z.object({
  guests: z.coerce.number().int().min(1, "1명 이상이어야 합니다"),
});

type GuestsFormValues = z.infer<typeof GuestsFormSchema>;

export default function BookingScreen() {
  const { roomId, roomName, price, maxGuests } = useLocalSearchParams<{
    roomId: string;
    roomName: string;
    price: string;
    maxGuests: string;
  }>();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestsFormValues>({
    resolver: zodResolver(GuestsFormSchema),
    defaultValues: { guests: 1 },
  });

  const onDayPress = (day: DateData) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day.dateString);
      setCheckOut(null);
      return;
    }
    if (day.dateString > checkIn) {
      setCheckOut(day.dateString);
    } else {
      setCheckIn(day.dateString);
      setCheckOut(null);
    }
  };

  const markedDates =
    checkIn && checkOut
      ? {
          [checkIn]: { startingDay: true, color: "#3b82f6", textColor: "white" },
          [checkOut]: { endingDay: true, color: "#3b82f6", textColor: "white" },
        }
      : checkIn
        ? { [checkIn]: { startingDay: true, endingDay: true, color: "#3b82f6", textColor: "white" } }
        : {};

  const onSubmit = async (values: GuestsFormValues) => {
    if (!checkIn || !checkOut) {
      Alert.alert("날짜를 선택하세요", "체크인과 체크아웃 날짜를 모두 선택해주세요.");
      return;
    }

    try {
      await createBooking({
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests: values.guests,
      });
      Alert.alert("예약 완료", "예약이 생성되었습니다.");
      router.replace("/my-bookings");
    } catch (error) {
      Alert.alert("예약 실패", error instanceof Error ? error.message : "알 수 없는 오류");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-4">
      <Stack.Screen options={{ title: "예약하기" }} />
      <Text className="mb-4 text-lg font-bold">
        {roomName} · {price}원/박 · 최대 {maxGuests}명
      </Text>

      <Text className="mb-2">
        체크인: {checkIn ?? "선택 안 함"} / 체크아웃: {checkOut ?? "선택 안 함"}
      </Text>

      <Calendar
        minDate={new Date().toISOString().split("T")[0]}
        markingType="period"
        markedDates={markedDates}
        onDayPress={onDayPress}
      />

      <Text className="mb-1 mt-4">인원</Text>
      <Controller
        control={control}
        name="guests"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-1 rounded-lg border border-gray-300 px-3 py-2"
            keyboardType="number-pad"
            value={String(value)}
            onChangeText={(text) => onChange(Number(text) || 0)}
          />
        )}
      />
      {errors.guests && <Text className="mb-2 text-red-500">{errors.guests.message}</Text>}

      <Pressable
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        className={`mt-6 min-h-11 items-center justify-center rounded-lg bg-blue-500 ${isSubmitting ? "opacity-50" : ""}`}
      >
        <Text className="font-semibold text-white">{isSubmitting ? "예약 중..." : "예약하기"}</Text>
      </Pressable>
    </View>
  );
}
