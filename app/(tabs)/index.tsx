import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useTimer from "@/lib/hooks/useTimer";
import TimePickerScreen from "@/components/deep-work/TimePickerScreen";
import TimerCompletedScreen from "@/components/deep-work/TimerCompletedScreen";
import TimerRunningScreen from "@/components/deep-work/TimerRunningScreen";

export default function IndexScreen() {
  const [selectedTime, setSelectedTime] = useState(0);

  const { timeLeft, status, startTimer, togglePause, stopTimer } = useTimer();

  const handleTimerComplete = async () => {
    await stopTimer();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {status === "inactive" && (
        <TimePickerScreen
          time={selectedTime}
          setTime={setSelectedTime}
          startTimer={startTimer}
        />
      )}

      {(status === "running" || status === "paused") && (
        <TimerRunningScreen
          timeLeft={timeLeft}
          isPaused={status === "paused"}
          togglePause={togglePause}
          stopTimer={stopTimer}
        />
      )}

      {status === "completed" && (
        <TimerCompletedScreen onDismiss={handleTimerComplete} />
      )}
    </SafeAreaView>
  );
}
