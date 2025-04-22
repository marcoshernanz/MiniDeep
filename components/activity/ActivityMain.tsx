import { Dimensions, ScrollView, View } from "react-native";
import ActivitySummary from "./ActivitySummary";
import { ActivityType } from "@/lib/hooks/useActivity";
import { isSameDay } from "date-fns";
import Swipable from "../Swipable";
import WorkDistributionChart from "./WorkDistributionChart";
import WorkSessionsList from "./WorkSessionsList";

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
  const currentIndex = activity.findIndex((a) =>
    isSameDay(a.date, selectedDate),
  );

  return (
    <Swipable
      className="mx-auto flex-1"
      data={activity}
      itemWidth={Dimensions.get("window").width}
      keyExtractor={(value, index) =>
        `${value.date.toISOString() || ""}-${index}`
      }
      initialIndex={currentIndex}
      currentIndex={currentIndex}
      onIndexChange={(index) => setSelectedDate(activity[index].date)}
      renderItem={({ item: activityData }) => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ActivitySummary
            totalTime={activityData.totalWorkTime}
            totalSessions={activityData.sessions.length}
          />

          <View className="mx-4 my-4 h-0.5 bg-muted"></View>

          <WorkDistributionChart
            timeDistribution={activityData.timeDistribution}
          />

          <View className="mx-4 my-4 h-0.5 bg-muted"></View>

          <WorkSessionsList sessions={activityData.sessions} />
        </ScrollView>
      )}
    />
  );
}
