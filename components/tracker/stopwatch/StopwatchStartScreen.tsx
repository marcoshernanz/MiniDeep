import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useStopwatchContext } from "@/context/StopwatchContext";
import { View } from "react-native";

export default function StopwatchStartScreen() {
  const {
    stopwatch: { startStopwatch },
  } = useStopwatchContext();

  return (
    <View className="flex-1 items-center justify-center">
      <View className="h-14 w-56">
        <Button size="lg" className="w-full" onPress={startStopwatch}>
          <Text className="native:text-2xl">Start</Text>
        </Button>
      </View>
    </View>
  );
}
