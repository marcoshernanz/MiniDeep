import useTimer from "@/lib/hooks/useTimer";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TrackerType } from "./TrackerContext";
import { AppState } from "react-native";

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
  trackerType: TrackerType;
  setTrackerType: (type: TrackerType) => void;
}

const defaultTime = 30 * 60 * 1000;

export default function TimerContextProvider({
  children,
  trackerType,
  setTrackerType,
}: Props) {
  const timer = useTimer();

  const [selectedTime, setSelectedTime] = useState(defaultTime);

  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      if (trackerType !== "timer") return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        await timer.saveCurrentTimerState();
      }
    },
    [timer, trackerType],
  );

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [handleAppStateChange]);

  return (
    <TimerContext.Provider
      value={{
        selectedTime,
        setSelectedTime,
        timer: {
          ...timer,
          stopTimer: () => {
            timer.stopTimer();
            setTrackerType(null);
          },
          startTimer: (duration: number) => {
            timer.startTimer(duration);
            setTrackerType("timer");
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
