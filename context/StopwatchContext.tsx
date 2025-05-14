import useTimer from "@/lib/hooks/useTimer";
import { TimerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useContext, useState } from "react";

interface StopWatchContextValue {
  status: TimerState["status"];
  startTimer: (duration: number) => void;
  togglePause: () => void;
  stopTimer: () => void;
}

export const StopWatchContext = createContext<StopWatchContextValue>({
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

export default function StopWatchContextProvider({ children }: Props) {
  const timer = useTimer();

  const [selectedTime, setSelectedTime] = useState(defaultTime);

  return (
    <StopWatchContext.Provider
      value={{
        selectedTime,
        setSelectedTime,
        timer,
      }}
    >
      {children}
    </StopWatchContext.Provider>
  );
}

export function StopWatchContextContext() {
  return useContext(StopWatchContext);
}
