import { useStopwatchContext } from "@/context/StopwatchContext";
import { View } from "react-native";
import StopwatchStartScreen from "./StopwatchStartScreen";
import StopwatchRunningScreen from "./StopwatchRunningScreen";

export default function Stopwatch() {
  const {
    stopwatch: { status },
  } = useStopwatchContext();

  return (
    <View className="size-full">
      {status === "inactive" && <StopwatchStartScreen />}

      {(status === "running" || status === "paused") && (
        <StopwatchRunningScreen />
      )}
    </View>
  );
}
