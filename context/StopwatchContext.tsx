import useStopwatch from "@/lib/hooks/useStopwatch";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useContext } from "react";
import { TrackerType, useTrackerContext } from "./TrackerContext";

interface StopwatchContextValue {
  stopwatch: {
    timeElapsed: number;
    status: TrackerState["status"];
    startStopwatch: () => void;
    togglePause: () => void;
    stopStopwatch: () => void;
  };
}

const StopwatchContext = createContext<StopwatchContextValue>({
  stopwatch: {
    timeElapsed: 0,
    status: "inactive",
    startStopwatch: () => {},
    togglePause: () => {},
    stopStopwatch: () => {},
  },
});

interface Props {
  children: React.ReactNode;
  setTrackerType: (type: TrackerType) => void;
}

export default function StopwatchContextProvider({
  children,
  setTrackerType,
}: Props) {
  const stopwatch = useStopwatch();

  return (
    <StopwatchContext.Provider
      value={{
        stopwatch: {
          ...stopwatch,
          stopStopwatch: () => {
            setTrackerType(null);
            stopwatch.stopStopwatch();
          },
          startStopwatch: () => {
            setTrackerType("stopwatch");
            stopwatch.startStopwatch();
          },
        },
      }}
    >
      {children}
    </StopwatchContext.Provider>
  );
}

export function useStopwatchContext() {
  return useContext(StopwatchContext);
}
