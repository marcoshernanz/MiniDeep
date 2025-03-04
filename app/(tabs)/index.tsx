import { useState, useEffect, useCallback } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import padWithZeros from "@/lib/utils/padWithZeros";
import useTimer from "@/lib/hooks/useTimer";
import { useWorkStats } from "@/lib/hooks/useWorkStats";
import TimePickerScreen from "@/components/deep-work/TimePickerScreen";
import TimerCompletedScreen from "@/components/deep-work/TimerCompletedScreen";
import TimerRunningScreen from "@/components/deep-work/TimerRunningScreen";

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

  const refreshStats = useCallback(() => {
    if (!isRunning) {
      refresh();
    }
  }, [isRunning, refresh]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {!isRunning && (
        <TimePickerScreen
          hours={selectedHours}
          setHours={setSelectedHours}
          minutes={selectedMinutes}
          setMinutes={setSelectedMinutes}
          startTimer={startTimer}
        />
      )}

      {isRunning && (
        <TimerRunningScreen
          hours={displayHours}
          minutes={displayMinutes}
          seconds={displaySeconds}
          isPaused={isPaused}
          togglePause={togglePause}
          stopTimer={stopTimer}
        />
      )}

      {isCompleted && <TimerCompletedScreen />}
    </SafeAreaView>
  );
}
