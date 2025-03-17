import { Dimensions, ScrollView, View } from "react-native";
import ActivitySummary from "./ActivitySummary";
import { ActivityType } from "@/lib/hooks/useActivity";
import { isSameDay } from "date-fns";
import Swipable from "../Swipable";

interface Props {
  activity: ActivityType[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function ActivityMain({
  activity,
  selectedDate,
  setSelectedDate,
}: Props) {
  const initialIndex = activity.findIndex((a) =>
    isSameDay(a.date, selectedDate),
  );

  return (
    <Swipable
      className="mx-auto flex-1 bg-red-600"
      data={activity}
      itemWidth={Dimensions.get("window").width}
      keyExtractor={(value, index) =>
        `${value.date.toISOString() || ""}-${index}`
      }
      initialIndex={initialIndex}
      onIndexChange={(index) => setSelectedDate(activity[index].date)}
      renderItem={({ item: activity }) => (
        <ScrollView>
          <ActivitySummary
            totalTime={activity.totalWorkTime}
            totalSessions={activity.totalSessions}
          />

          <View className="mx-4 mt-4 h-0.5 bg-muted"></View>
        </ScrollView>
      )}
    />
  );
}
