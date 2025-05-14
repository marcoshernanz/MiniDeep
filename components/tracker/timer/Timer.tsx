import TimerCompletedScreen from "@/components/tracker/timer/TimerCompletedScreen";
import TimerRunningScreen from "@/components/tracker/timer/TimerRunningScreen";
import { useTimerContext } from "@/context/TimerContext";
import { View } from "react-native";
import TimerTimePickerScreen from "./TimerTimePickerScreen";

export default function Timer() {
  const {
    timer: { status },
  } = useTimerContext();

  return (
    <View className="size-full">
      {status === "inactive" && <TimerTimePickerScreen />}

      {(status === "running" || status === "paused") && <TimerRunningScreen />}

      {status === "completed" && <TimerCompletedScreen />}
    </View>
  );
}
