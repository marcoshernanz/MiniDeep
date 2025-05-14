import useTimer from "@/lib/hooks/useTimer";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useContext, useState } from "react";
import useStopwatch from "@/lib/hooks/useStopwatch";

interface StopwatchContextValue {
  status: TrackerState["status"];
  startStopwatch: () => void;
  togglePause: () => void;
  stopStopwatch: () => void;
}

export const StopwatchContext = createContext<StopwatchContextValue>({
  status: "inactive",
  startStopwatch: () => {},
  togglePause: () => {},
  stopStopwatch: () => {},
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
