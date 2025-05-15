import useTimer from "@/lib/hooks/useTimer";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useContext, useState } from "react";
import { useTrackerContext } from "./TrackerContext";

interface TimerContextValue {
  selectedTime: number;
  setSelectedTime: (time: number) => void;

  timer: {
    timeLeft: number;
    status: TrackerState["status"];
    startTimer: (duration: number) => void;
    togglePause: () => void;
    stopTimer: () => void;
  };
}

const TimerContext = createContext<TimerContextValue>({
  selectedTime: 0,
  setSelectedTime: () => {},

  timer: {
    timeLeft: 0,
    status: "inactive",
    startTimer: () => {},
    togglePause: () => {},
    stopTimer: () => {},
  },
});

interface Props {
  children: React.ReactNode;
}

const defaultTime = 30 * 60 * 1000;

export default function TimerContextProvider({ children }: Props) {
  const { setTrackerType } = useTrackerContext();
  const timer = useTimer();

  const [selectedTime, setSelectedTime] = useState(defaultTime);

  return (
    <TimerContext.Provider
      value={{
        selectedTime,
        setSelectedTime,
        timer: {
          ...timer,
          stopTimer: () => {
            setTrackerType(null);
            timer.stopTimer();
          },
          startTimer: (duration: number) => {
            setTrackerType("timer");
            timer.startTimer(duration);
          },
        },
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  return useContext(TimerContext);
}
