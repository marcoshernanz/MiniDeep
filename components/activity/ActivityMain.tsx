import { Dimensions, ScrollView, View } from "react-native";
import ActivitySummary from "./ActivitySummary";
import { isSameDay } from "date-fns";
import Swipable from "../Swipable";
import WorkDistributionChart from "./WorkDistributionChart";
import WorkSessionsList from "./WorkSessionsList";
import { useActivityContext } from "@/context/ActivityContext";

export default function ActivityMain() {
  const { activity, selectedDate, setSelectedDate, swipableRef } =
    useActivityContext();

  const currentIndex = activity.findIndex((a) =>
    isSameDay(a.date, selectedDate),
  );

  return (
    <Swipable
      ref={swipableRef}
      className="mx-auto flex-1"
      data={activity}
      itemWidth={Dimensions.get("window").width}
      keyExtractor={(value, index) =>
        `${value.date.toISOString() || ""}-${index}`
      }
      initialIndex={currentIndex}
      onIndexChange={(index) => setSelectedDate(activity[index].date)}
      renderItem={({ item: activityData }) => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pb-6">
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
          </View>
        </ScrollView>
      )}
    />
  );
}
