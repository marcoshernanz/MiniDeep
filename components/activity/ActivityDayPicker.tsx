import { View, Dimensions, TouchableOpacity } from "react-native";
import { Text } from "../ui/Text";
import groupDaysIntoWeeks from "@/lib/utils/groupDaysIntoWeeks";
import cn from "@/lib/utils/cn";
import Swipable from "../Swipable";
import { useActivityContext } from "@/context/ActivityContext";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export default function ActivityDayPicker() {
  const { activity, selectedDate, setSelectedDate, scrollToDate } =
    useActivityContext();

  const days = activity.map((a) => a.date);
  const weeks = groupDaysIntoWeeks(days);

  const currentIndex = weeks.findIndex((week) =>
    week.some(
      (day) => day && day.toDateString() === selectedDate.toDateString()
    )
  );

  const onPress = (day: Date) => {
    setSelectedDate(day);
    scrollToDate(day);
  };

  return (
    <Swipable
      className="mx-auto"
      data={weeks}
      itemWidth={Dimensions.get("window").width}
      keyExtractor={(value, index) => `${value[0]?.toString() || ""}-${index}`}
      initialIndex={currentIndex}
      renderItem={({ item: week }) => (
        <View className="h-12 flex-row items-center justify-between px-4">
          {week.map((day, index) => (
            <TouchableOpacity
              key={`${day?.toDateString()}-${index}`}
              onPress={() => day && onPress(day)}
              className={cn(
                "aspect-square size-12 items-center justify-center rounded-full bg-muted disabled:bg-muted/50",
                selectedDate.toDateString() === (day?.toDateString() || "") &&
                  "bg-primary text-primary-foreground"
              )}
              disabled={!day}
            >
              <Text>{weekdays[index]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    />
  );
}
