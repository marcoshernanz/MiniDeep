import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import TimeFrameSelector from "@/components/statistics/TimeFrameSelector";
import TimeWorkedChart from "@/components/statistics/TimeWorkedChart";
import useStatistics, { statisticsTimeFrames } from "@/lib/hooks/useStatistics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  const { loading, statistics, numDotsVisible, timeFrame, setTimeFrame } =
    useStatistics();

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-background py-6">
        <StatisticsHeader />
        <TimeFrameSelector
          timeFrames={statisticsTimeFrames}
          selectedTimeFrame={timeFrame}
          setSelectedTimeFrame={setTimeFrame}
        />
        <TimeWorkedChart data={statistics} numDotsVisible={numDotsVisible} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
