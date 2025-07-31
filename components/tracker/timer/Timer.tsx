import TimerCompletedScreen from "@/components/tracker/timer/TimerCompletedScreen";
import TimerRunningScreen from "@/components/tracker/timer/TimerRunningScreen";
import { useTimerContext } from "@/context/OLDTimerContext";
import { View } from "react-native";

export default function Timer() {
  const {
    timer: { status },
  } = useTimerContext();

  return (
    <View className="size-full">
      {(status === "running" || status === "paused") && <TimerRunningScreen />}

      {status === "completed" && <TimerCompletedScreen />}
    </View>
  );
}
