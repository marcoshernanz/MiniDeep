import { SafeAreaView } from "react-native-safe-area-context";
import TimePickerScreen from "@/components/timer/TimePickerScreen";
import TimerCompletedScreen from "@/components/timer/TimerCompletedScreen";
import TimerRunningScreen from "@/components/timer/TimerRunningScreen";
import { useTimerContext } from "@/context/TimerContext";

export default function Timer() {
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
