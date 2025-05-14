import TimePickerScreen from "@/components/tracker/timer/TimePickerScreen";
import TimerCompletedScreen from "@/components/tracker/timer/TimerCompletedScreen";
import TimerRunningScreen from "@/components/tracker/timer/TimerRunningScreen";
import { useTimerContext } from "@/context/TimerContext";
import { View } from "react-native";

export default function Timer() {
  const {
    timer: { status },
  } = useTimerContext();

  return (
    <View className="size-full flex-1">
      {status === "inactive" && <TimePickerScreen />}

      {(status === "running" || status === "paused") && <TimerRunningScreen />}

      {status === "completed" && <TimerCompletedScreen />}
    </View>
  );
}
