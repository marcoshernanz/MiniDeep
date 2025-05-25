import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import TimeFrameSelector from "@/components/statistics/TimeFrameSelector";
import TimeWorkedChart from "@/components/statistics/TimeWorkedChart";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Statistics() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-background pt-6">
        <StatisticsHeader />
        <TimeFrameSelector />
        <TimeWorkedChart />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
