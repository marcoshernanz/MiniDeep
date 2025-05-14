import Swipable from "@/components/Swipable";
import Stopwatch from "@/components/tracker/stopwatch/Stopwatch";
import Timer from "@/components/tracker/timer/Timer";
import StopwatchContextProvider from "@/context/StopwatchContext";
import TimerContextProvider from "@/context/TimerContext";
import { SafeAreaView } from "react-native";

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1">
      <Swipable
        data={[null, null]}
        keyExtractor={(value, index) => `${value}-${index}`}
        renderItem={({ index }) => (
          <>
            {index === 0 && (
              <TimerContextProvider>
                <Timer />
              </TimerContextProvider>
            )}
            {index === 1 && (
              <StopwatchContextProvider>
                <Stopwatch />
              </StopwatchContextProvider>
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
}
