import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import TimeFrameSelector from "@/components/statistics/TimeFrameSelector";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export type TimeFrameType = "1W" | "1M" | "3M" | "1Y" | "All";
const timeFrames: TimeFrameType[] = ["1W", "1M", "3M", "1Y", "All"];

export default function StatsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrameType>("1W");

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-background py-6">
        <StatisticsHeader />
        <TimeFrameSelector
          timeFrames={timeFrames}
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
