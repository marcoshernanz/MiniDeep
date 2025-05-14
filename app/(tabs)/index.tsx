import Tracker from "@/components/tracker/Tracker";
import TimerContextProvider from "@/context/TimerContext";

export default function IndexScreen() {
  return (
    <TimerContextProvider>
      <Tracker />
    </TimerContextProvider>
  );
}
