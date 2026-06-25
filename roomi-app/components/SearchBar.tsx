import { useState } from "react";
import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { DateData } from "react-native-calendars";
import { GradientButton } from "./GradientButton";
import { DateRangeCalendar } from "./DateRangeCalendar";

type SearchValues = {
  region?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

const REGIONS = ["서울", "부산", "인천", "강원", "경주", "제주"];

type SearchBarProps = {
  onSearch: (values: SearchValues) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [region, setRegion] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

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
      <Pressable className="rounded-lg border border-gray-300 px-3 py-2" onPress={() => setIsRegionOpen(true)}>
        <Text className={region ? "" : "text-gray-400"}>{region || "지역 선택"}</Text>
      </Pressable>

      <Pressable className="rounded-lg border border-gray-300 px-3 py-2" onPress={() => setIsCalendarOpen(true)}>
        <Text>{checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : "체크인 · 체크아웃 선택"}</Text>
      </Pressable>

      <TextInput className="rounded-lg border border-gray-300 px-3 py-2" placeholder="인원" keyboardType="number-pad" value={guests} onChangeText={setGuests} />

      <GradientButton label="검색" onPress={handleSearch} />

      <Modal visible={isCalendarOpen} animationType="slide" transparent onRequestClose={() => setIsCalendarOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setIsCalendarOpen(false)}>
          <View className="mt-auto rounded-t-2xl bg-white px-4 py-10">
            <DateRangeCalendar checkIn={checkIn} checkOut={checkOut} onDayPress={onDayPress} />
            <GradientButton label="확인" onPress={() => setIsCalendarOpen(false)} className="mt-6" />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={isRegionOpen} animationType="slide" transparent onRequestClose={() => setIsRegionOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setIsRegionOpen(false)}>
          <View className="mt-auto rounded-t-2xl bg-white px-4 py-6">
            <Text className="mb-4 text-lg font-bold">지역 선택</Text>
            {REGIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setRegion(option);
                  setIsRegionOpen(false);
                }}
                className={`mb-2 min-h-11 items-center justify-center rounded-lg border ${region === option ? "border-sky-500 bg-sky-50" : "border-gray-300"}`}
              >
                <Text>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
