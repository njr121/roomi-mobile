import { useEffect, useMemo, useState } from "react";
import { View, Text, Alert, Platform, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateData } from "react-native-calendars";
import { createBooking } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { GradientButton } from "@/components/GradientButton";
import { AppHeader } from "@/components/AppHeader";
import { DateRangeCalendar } from "@/components/DateRangeCalendar";
import { GuestSelector } from "@/components/GuestSelector";

function createGuestsFormSchema(maxGuests: number) {
  return z.object({
    guests: z.coerce.number().int().min(1, "1명 이상이어야 합니다").max(maxGuests, `최대 ${maxGuests}명까지 가능합니다`),
  });
}

type GuestsFormValues = z.infer<ReturnType<typeof createGuestsFormSchema>>;

export default function BookingScreen() {
  const { roomId, roomName, price, maxGuests } = useLocalSearchParams<{
    roomId: string;
    roomName: string;
    price: string;
    maxGuests: string;
  }>();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  useEffect(() => {
    if (isRestoring) return;
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, isRestoring]);

  const guestsFormSchema = useMemo(() => createGuestsFormSchema(Number(maxGuests)), [maxGuests]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestsFormValues>({
    resolver: zodResolver(guestsFormSchema),
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

  const nights = checkIn && checkOut ? (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24) : 0;
  const totalPrice = nights * Number(price);

  const notify = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const onSubmit = async (values: GuestsFormValues) => {
    if (!checkIn || !checkOut) {
      notify("날짜를 선택하세요", "체크인과 체크아웃 날짜를 모두 선택해주세요.");
      return;
    }

    try {
      await createBooking({
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests: values.guests,
      });
      notify("예약 완료", "예약이 생성되었습니다.");
      router.replace("/my-bookings");
    } catch (error) {
      notify("예약 실패", error instanceof Error ? error.message : "알 수 없는 오류");
    }
  };

  return (
    <View className="flex-1">
      <AppHeader variant="title" title="예약하기" showBack />
      <ScrollView className="flex-1 bg-white px-4 py-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mb-4 text-lg font-bold">
          {roomName} · {price}원/박 · 최대 {maxGuests}명
        </Text>

        <Text className="mb-2">
          체크인: {checkIn ?? "선택 안 함"} / 체크아웃: {checkOut ?? "선택 안 함"}
        </Text>

        {checkIn && checkOut && (
          <View className="bg-sky-50 rounded-xl p-4 mb-4">
            <Text className="text-sm font-bold">
              {Number(price).toLocaleString()}원 x {nights}박 =
            </Text>
            <Text className="text-xl font-bold text-sky-600 mt-1">{totalPrice.toLocaleString()}원</Text>
          </View>
        )}

        <DateRangeCalendar checkIn={checkIn} checkOut={checkOut} onDayPress={onDayPress} />

        <Text className="mb-1 mt-4">인원</Text>
        <Controller control={control} name="guests" render={({ field: { onChange, value } }) => <GuestSelector max={Number(maxGuests)} value={value} onChange={onChange} />} />
        {errors.guests && <Text className="mb-2 text-red-500">{errors.guests.message}</Text>}

        <GradientButton label={isSubmitting ? "예약 중..." : "예약하기"} disabled={isSubmitting} onPress={handleSubmit(onSubmit)} className="mt-6" />
      </ScrollView>
    </View>
  );
}
