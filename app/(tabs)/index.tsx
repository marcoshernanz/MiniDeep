import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
    resetTimer,
  } = useTimer();

  const refreshStats = useCallback(() => {
    if (!isRunning) {
      refresh();
    }
  }, [isRunning, refresh]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const handleTimerComplete = async () => {
    await resetTimer();
    refreshStats();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {!isRunning && !isCompleted && (
        <TimePickerScreen
          hours={selectedHours}
          setHours={setSelectedHours}
          minutes={selectedMinutes}
          setMinutes={setSelectedMinutes}
          startTimer={startTimer}
        />
      )}

      {isRunning && !isCompleted && (
        <TimerRunningScreen
          hours={displayHours}
          minutes={displayMinutes}
          seconds={displaySeconds}
          isPaused={isPaused}
          togglePause={togglePause}
          stopTimer={stopTimer}
        />
      )}

      {isCompleted && <TimerCompletedScreen onDismiss={handleTimerComplete} />}
    </SafeAreaView>
  );
}
