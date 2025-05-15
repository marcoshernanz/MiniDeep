import Stopwatch from "@/components/tracker/stopwatch/Stopwatch";
import Timer from "@/components/tracker/timer/Timer";
import TrackerPickerScreen from "@/components/tracker/TrackerPickerScreen";
import StopwatchContextProvider from "@/context/StopwatchContext";
import TimerContextProvider from "@/context/TimerContext";
import getTrackerState from "@/lib/tracker/getTrackerState";
import { useState } from "react";
import { SafeAreaView } from "react-native";

export default function IndexScreen() {
  const [trackerState, _] = useState(getTrackerState());

  return (
    <TimerContextProvider>
      <StopwatchContextProvider>
        <SafeAreaView className="flex-1">
          {trackerState === null || trackerState.status === "inactive" ? (
            <TrackerPickerScreen />
          ) : trackerState.type === "timer" ? (
            <Timer />
          ) : (
            <Stopwatch />
          )}
        </SafeAreaView>
      </StopwatchContextProvider>
    </TimerContextProvider>
  );
}
