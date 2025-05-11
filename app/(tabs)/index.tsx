import Timer from "@/components/timer/Timer";
import TimerContextProvider from "@/context/TimerContext";

export default function IndexScreen() {
  return (
    <TimerContextProvider>
      <Timer />
    </TimerContextProvider>
  );
}
