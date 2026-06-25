import { Calendar, DateData } from "react-native-calendars";

function getDateBetween(start: string, end: string): string[] {
  const dates = [];
  const last = new Date(end);

  for (let current = new Date(start); current <= last; current.setDate(current.getDate() + 1)) {
    dates.push(current.toISOString().split("T")[0]);
  }

  return dates;
}

type DateRangeCalendarProps = {
  checkIn: string | null;
  checkOut: string | null;
  onDayPress: (day: DateData) => void;
};

export function DateRangeCalendar({ checkIn, checkOut, onDayPress }: DateRangeCalendarProps) {
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
  return <Calendar minDate={new Date().toISOString().split("T")[0]} markingType="period" markedDates={markedDates} onDayPress={onDayPress} />;
}
