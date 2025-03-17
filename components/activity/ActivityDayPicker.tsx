import { View, Dimensions, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import groupDaysIntoWeeks from "@/lib/utils/groupDaysIntoWeeks";
import cn from "@/lib/utils/cn";
import Swipable from "../Swipable";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

interface Props {
  days: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function ActivityDayPicker({
  days,
  selectedDate,
  setSelectedDate,
}: Props) {
  const weeks = groupDaysIntoWeeks(days);

  const initialIndex = weeks.findIndex((week) =>
    week.some(
      (day) => day && day.toDateString() === selectedDate.toDateString(),
    ),
  );

  return (
    <Swipable
      className="mx-auto"
      data={weeks}
      itemWidth={Dimensions.get("window").width}
      keyExtractor={(value, index) => `${value[0]?.toString() || ""}-${index}`}
      initialIndex={initialIndex}
      renderItem={({ item: week }) => (
        <View className="h-14 flex-row items-center justify-between px-4">
          {week.map((day, index) => (
            <TouchableOpacity
              key={`${day?.toDateString()}-${index}`}
              onPress={() => day && setSelectedDate(day)}
              className={cn(
                "aspect-square size-12 items-center justify-center rounded-full bg-muted disabled:bg-muted/50",
                selectedDate.toDateString() === (day?.toDateString() || "") &&
                  "bg-primary text-primary-foreground",
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
