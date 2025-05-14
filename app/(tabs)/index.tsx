import Swipable from "@/components/Swipable";
import Tracker from "@/components/tracker/Tracker";
import TimerContextProvider from "@/context/TimerContext";

export default function IndexScreen() {
  return (
    <Swipable
      data={[null, null]}
      keyExtractor={(value, index) => `${value}-${index}`}
      renderItem={({ item, index }) => (
        <>
          {index === 0 && (
            <TimerContextProvider>
              <Tracker />
            </TimerContextProvider>
          )}
          {index === 1 && (
            // <StopwatchContextProvider>
            <Stopwatch />
            // </StopwatchContextProvider>
          )}
        </>
      )}
    />
  );
}
