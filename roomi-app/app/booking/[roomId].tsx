import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Alert, Platform, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DateData } from "react-native-calendars";
import { createBooking } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { GradientButton } from "@/components/GradientButton";
import { AppHeader } from "@/components/AppHeader";

function createGuestsFormSchema(maxGuests: number) {
  return z.object({
    guests: z.coerce.number().int().min(1, "1명 이상이어야 합니다").max(maxGuests, `최대 ${maxGuests}명까지 가능합니다`),
  });
}

function getDateBetween(start: string, end: string): string[] {
  const dates = [];
  const last = new Date(end);

  for (let current = new Date(start); current <= last; current.setDate(current.getDate() + 1)) {
    dates.push(current.toISOString().split("T")[0]);
  }

  return dates;
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

  const markedDates =
    checkIn && checkOut
      ? getDateBetween(checkIn, checkOut).reduce<Record<string, object>>((acc, date, index, all) => {
          acc[date] = {
            startingDay: index === 0,
            endingDay: index === all.length - 1,
            color: "#0ea5e9",
            textColor: "white",
          };
          return acc;
        }, {})
      : checkIn
        ? { [checkIn]: { startingDay: true, endingDay: true, color: "#0ea5e9", textColor: "white" } }
        : {};

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

        <Calendar minDate={new Date().toISOString().split("T")[0]} markingType="period" markedDates={markedDates} onDayPress={onDayPress} />

        <Text className="mb-1 mt-4">인원</Text>
        <Controller
          control={control}
          name="guests"
          render={({ field: { onChange, value } }) => (
            <TextInput className="mb-1 rounded-lg border border-gray-300 px-3 py-2" keyboardType="number-pad" value={String(value)} onChangeText={(text) => onChange(Number(text) || 0)} />
          )}
        />
        {errors.guests && <Text className="mb-2 text-red-500">{errors.guests.message}</Text>}

        <GradientButton label={isSubmitting ? "예약 중..." : "예약하기"} disabled={isSubmitting} onPress={handleSubmit(onSubmit)} className="mt-6" />
      </ScrollView>
    </View>
  );
}
