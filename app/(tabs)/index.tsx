import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/deep-work/TimePicker";
import padWithZeros from "@/lib/padWithZeros";
import useTimer from "@/lib/hooks/useTimer";

export default function IndexScreen() {
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(30);

  const {
    hours: displayHours,
    minutes: displayMinutes,
    seconds: displaySeconds,
    isRunning,
    isPaused,
    isCompleted,
    startTimer,
    togglePause,
    stopTimer,
  } = useTimer();

  const handleStartTimer = () => {
    startTimer({ hours: selectedHours, minutes: selectedMinutes });
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="gap-10">
        {!isRunning && (
          <>
            <TimePicker
              hours={selectedHours}
              setHours={setSelectedHours}
              minutes={selectedMinutes}
              setMinutes={setSelectedMinutes}
            />
            <View>
              <Button size="lg" className="w-full" onPress={handleStartTimer}>
                <Text className="native:text-2xl">Start</Text>
              </Button>
            </View>
          </>
        )}

        {isRunning && (
          <>
            <View className="size-64 flex-row items-center justify-center rounded-full border-2 border-primary">
              <Text className="w-16 text-center text-5xl">
                {padWithZeros(displayHours, 2)}
              </Text>
              <Text className="text-5xl font-medium">:</Text>
              <Text className="w-16 text-center text-5xl">
                {padWithZeros(displayMinutes, 2)}
              </Text>
              <Text className="text-5xl font-medium">:</Text>
              <Text className="w-16 text-center text-5xl">
                {padWithZeros(displaySeconds, 2)}
              </Text>
            </View>
            <View className="flex-row gap-4">
              <Button
                size="lg"
                variant={isPaused ? "default" : "outline"}
                onPress={togglePause}
              >
                <Text className="native:text-lg">
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </Button>
              <Button size="lg" variant="destructive" onPress={stopTimer}>
                <Text className="native:text-lg">Stop</Text>
              </Button>
            </View>
            {isCompleted && (
              <View className="mt-4">
                <Text className="text-center text-xl font-bold">
                  Time's up!
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
