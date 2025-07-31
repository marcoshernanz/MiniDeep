import useStopwatch from "@/lib/hooks/OLDuseStopwatch";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import { createContext, useCallback, useContext, useEffect } from "react";
import { TrackerType, useTrackerContext } from "./OLDTrackerContext";
import { AppState } from "react-native";

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
  trackerType: TrackerType;
  setTrackerType: (type: TrackerType) => void;
}

export default function StopwatchContextProvider({
  children,
  trackerType,
  setTrackerType,
}: Props) {
  const stopwatch = useStopwatch();

  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      if (trackerType !== "stopwatch") return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        await stopwatch.saveCurrentStopwatchState();
      }
    },
    [stopwatch, trackerType]
  );

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [handleAppStateChange]);

  return (
    <StopwatchContext.Provider
      value={{
        stopwatch: {
          ...stopwatch,
          stopStopwatch: () => {
            stopwatch.stopStopwatch();
            setTrackerType(null);
          },
          startStopwatch: () => {
            stopwatch.startStopwatch();
            setTrackerType("stopwatch");
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
