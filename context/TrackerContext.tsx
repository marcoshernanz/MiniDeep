import getTrackerState from "@/lib/tracker/getTrackerState";
import { createContext, useContext, useState } from "react";
import TimerContextProvider from "./TimerContext";
import StopwatchContextProvider from "./StopwatchContext";

type TrackerType = "timer" | "stopwatch" | null;

interface TrackerContextValue {
  trackerType: TrackerType;
  setTrackerType: (type: TrackerType) => void;
}

const TrackerContext = createContext<TrackerContextValue>({
  trackerType: null,
  setTrackerType: () => {},
});

interface Props {
  children: React.ReactNode;
}

export default function TrackerContextProvider({ children }: Props) {
  const [trackerType, setTrackerType] = useState<TrackerType>(() => {
    const state = getTrackerState();
    return state ? state.type : null;
  });

  return (
    <TrackerContext.Provider value={{ trackerType, setTrackerType }}>
      <TimerContextProvider>
        <StopwatchContextProvider>{children}</StopwatchContextProvider>
      </TimerContextProvider>
    </TrackerContext.Provider>
  );
}

export function useTrackerContext() {
  return useContext(TrackerContext);
}
