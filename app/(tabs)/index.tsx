import { useState, useEffect, useCallback } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/deep-work/TimePicker";
import padWithZeros from "@/lib/padWithZeros";
import useTimer from "@/lib/hooks/useTimer";
import { useWorkStats } from "@/lib/hooks/useWorkStats";

export default function IndexScreen() {
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const { refresh } = useWorkStats();

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

  // Create memoized function to avoid dependency changes
  const refreshStats = useCallback(() => {
    if (!isRunning) {
      refresh();
    }
  }, [isRunning, refresh]);

  // Use the memoized function in useEffect
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

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
            <View className="h-14">
              <Button size="lg" className="w-full" onPress={handleStartTimer}>
                <Text className="native:text-2xl">Start</Text>
              </Button>
            </View>
          </>
        )}

        {isRunning && (
          <>
            <View className="m-4 size-64 flex-row items-center justify-center rounded-full border-2 border-primary">
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
                onPress={stopTimer}
              >
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
