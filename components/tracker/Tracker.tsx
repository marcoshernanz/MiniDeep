import { SafeAreaView } from "react-native-safe-area-context";
import TimePickerScreen from "@/components/tracker/TimePickerScreen";
import TimerCompletedScreen from "@/components/tracker/TimerCompletedScreen";
import TimerRunningScreen from "@/components/tracker/TimerRunningScreen";
import { useTimerContext } from "@/context/TimerContext";

export default function Tracker() {
  const {
    timer: { status },
  } = useTimerContext();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {status === "inactive" && <TimePickerScreen />}

      {(status === "running" || status === "paused") && <TimerRunningScreen />}

      {status === "completed" && <TimerCompletedScreen />}
    </SafeAreaView>
  );
}
