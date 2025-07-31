import { useStopwatchContext } from "@/context/OLDStopwatchContext";
import { View } from "react-native";
import StopwatchRunningScreen from "./StopwatchRunningScreen";

export default function Stopwatch() {
  const {
    stopwatch: { status },
  } = useStopwatchContext();

  return (
    <View className="size-full">
      {(status === "running" || status === "paused") && (
        <StopwatchRunningScreen />
      )}
    </View>
  );
}
