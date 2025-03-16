import { View, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import groupDaysIntoWeeks from "@/lib/utils/groupDaysIntoWeeks";
import cn from "@/lib/utils/cn";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const { width } = Dimensions.get("window");
const containerWidth = width;

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

  const initialScrollIndex = weeks.findIndex((week) =>
    week.some(
      (day) => day && day.toDateString() === selectedDate.toDateString(),
    ),
  );

  return (
    <View className="mx-auto" style={{ width: containerWidth }}>
      <FlatList
        data={weeks}
        keyExtractor={(value, index) =>
          `${value[0]?.toString() || ""}-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={containerWidth}
        decelerationRate="normal"
        disableIntervalMomentum
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        initialScrollIndex={
          initialScrollIndex >= 0 ? initialScrollIndex : weeks.length - 1
        }
        renderItem={({ item: week }) => (
          <View
            className="h-14 flex-row items-center justify-between px-4"
            style={{ width: containerWidth }}
          >
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
    </View>
  );
}
