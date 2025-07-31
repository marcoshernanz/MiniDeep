import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/Text";
import { useStopwatchContext } from "@/context/OLDStopwatchContext";
import extractTime from "@/lib/utils/extractTime";
import padWithZeros from "@/lib/utils/padWithZeros";
import { View } from "react-native";

export default function StopwatchRunningScreen() {
  const {
    stopwatch: { timeElapsed, status, togglePause, stopStopwatch },
  } = useStopwatchContext();

  const isPaused = status === "paused";

  const { hours, minutes, seconds } = extractTime(timeElapsed);

  return (
    <View className="flex-1 items-center justify-center">
      <View className="gap-10">
        <View className="m-4 size-64 flex-row items-center justify-center rounded-full border-2 border-primary">
          <Text className="w-16 text-center text-5xl">
            {padWithZeros(hours, 2)}
          </Text>
          <Text className="text-5xl font-medium">:</Text>
          <Text className="w-16 text-center text-5xl">
            {padWithZeros(minutes, 2)}
          </Text>
          <Text className="text-5xl font-medium">:</Text>
          <Text className="w-16 text-center text-5xl">
            {padWithZeros(seconds, 2)}
          </Text>
        </View>
        <View className="mx-auto h-14 w-full max-w-64 flex-row gap-4">
          <Button
            size="lg"
            className="flex-1 px-2"
            variant={isPaused ? "default" : "outline"}
            onPress={togglePause}
          >
            <Text className="native:text-lg">
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="flex-1 px-2"
            onPress={stopStopwatch}
          >
            <Text className="native:text-lg">Stop</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
