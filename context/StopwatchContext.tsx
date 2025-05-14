import useStopwatch from "@/lib/hooks/useStopwatch";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useContext } from "react";

interface StopwatchContextValue {
  stopwatch: {
    timeElapsed: number;
    status: TrackerState["status"];
    startStopwatch: () => void;
    togglePause: () => void;
    stopStopwatch: () => void;
  };
}

export const StopwatchContext = createContext<StopwatchContextValue>({
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
}

export default function StopwatchContextProvider({ children }: Props) {
  const stopwatch = useStopwatch();

  return (
    <StopwatchContext.Provider value={{ stopwatch }}>
      {children}
    </StopwatchContext.Provider>
  );
}

export function StopwatchContextContext() {
  return useContext(StopwatchContext);
}
