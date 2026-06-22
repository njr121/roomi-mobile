import { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type SearchValues = {
  region?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

type SearchBarProps = {
  onSearch: (values: SearchValues) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [region, setRegion] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const handleSearch = () => {
    onSearch({
      region: region || undefined,
      checkIn: checkIn ?? undefined,
      checkOut: checkOut ?? undefined,
      guests: guests ? Number(guests) : undefined,
    });
  };

  return (
    <View className="gap-2 border-b border-gray-200 px-4 py-3">
      <TextInput
        className="rounded border border-gray-300 px-3 py-2"
        placeholder="지역 (예: 서울)"
        value={region}
        onChangeText={setRegion}
      />

      <Pressable
        className="rounded border border-gray-300 px-3 py-2"
        onPress={() => setIsCalendarOpen(true)}
      >
        <Text>
          {checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : "체크인 · 체크아웃 선택"}
        </Text>
      </Pressable>

      <TextInput
        className="rounded border border-gray-300 px-3 py-2"
        placeholder="인원"
        keyboardType="number-pad"
        value={guests}
        onChangeText={setGuests}
      />

      <Pressable
        onPress={handleSearch}
        className="min-h-11 items-center justify-center rounded-lg bg-blue-500"
      >
        <Text className="font-semibold text-white">검색</Text>
      </Pressable>

      <Modal visible={isCalendarOpen} animationType="slide">
        <View className="flex-1 bg-white px-4 py-10">
          <Calendar
            minDate={new Date().toISOString().split("T")[0]}
            markingType="period"
            markedDates={markedDates}
            onDayPress={onDayPress}
          />
          <Pressable
            onPress={() => setIsCalendarOpen(false)}
            className="mt-6 min-h-11 items-center justify-center rounded-lg bg-blue-500"
          >
            <Text className="font-semibold text-white">확인</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
