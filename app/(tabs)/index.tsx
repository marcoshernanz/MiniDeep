import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useTimer from "@/lib/hooks/useTimer";
import TimePickerScreen from "@/components/deep-work/TimePickerScreen";
import TimerCompletedScreen from "@/components/deep-work/TimerCompletedScreen";
import TimerRunningScreen from "@/components/deep-work/TimerRunningScreen";

export default function IndexScreen() {
  const [selectedTime, setSelectedTime] = useState(0);

  const {
    timeLeft,
    isRunning,
    isPaused,
    isCompleted,
    startTimer,
    togglePause,
    stopTimer,
    resetTimer,
  } = useTimer();

  const handleTimerComplete = async () => {
    await resetTimer();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {!isRunning && !isCompleted && (
        <TimePickerScreen
          time={selectedTime}
          setTime={setSelectedTime}
          startTimer={startTimer}
        />
      )}

      {isRunning && !isCompleted && (
        <TimerRunningScreen
          timeLeft={timeLeft}
          isPaused={isPaused}
          togglePause={togglePause}
          stopTimer={stopTimer}
        />
      )}

      {isCompleted && <TimerCompletedScreen onDismiss={handleTimerComplete} />}
    </SafeAreaView>
  );
}
