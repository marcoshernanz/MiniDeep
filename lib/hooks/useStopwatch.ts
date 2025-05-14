import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTrackerState from "../tracker/getTrackerState";
import saveTrackerState from "../tracker/saveTrackerState";
import markSessionAsCompleted from "../time-tracking/markSessionAsCompleted";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";
import createAccurateInterval from "../utils/createAccurateInterval";

export default function useStopwatch() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [status, setStatus] = useState<TrackerState["status"]>("inactive");

  const timerRef = useRef({
    accurateInterval: null as ReturnType<typeof createAccurateInterval> | null,
    status: "inactive" as TrackerState["status"],
    sessionId: "",
    startTime: 0,
    tickTime: 0,
  });
  const isRestoringState = useRef(false);

  const timerTick = useCallback(() => {
    if (timerRef.current.status !== "running") return;

    const now = Date.now();
    const elapsed = now - timerRef.current.startTime;
    setTimeElapsed(elapsed);
    timerRef.current.tickTime = now;
  }, []);

  if (!timerRef.current.accurateInterval) {
    timerRef.current.accurateInterval = createAccurateInterval(timerTick, 250);
  }

  const startStopwatch = () => {
    const now = Date.now();

    timerRef.current.startTime = now;
    timerRef.current.tickTime = now;

    timerRef.current.status = "running";
    setStatus("running");
    setTimeElapsed(0);
    timerRef.current.accurateInterval?.start();

    const createdSessionId = createNewSession({
      type: "stopwatch",
      duration: 0,
      startTime: now,
    });
    timerRef.current.sessionId = createdSessionId;

    addTimeEvent({
      sessionId: timerRef.current.sessionId,
      action: "start",
      time: timerRef.current.tickTime,
    });
  };

  const togglePause = () => {
    if (status === "paused") {
      const now = Date.now();

      timerRef.current.startTime = now;
      timerRef.current.tickTime = now;

      timerRef.current.status = "running";
      setStatus("running");
      timerRef.current.accurateInterval?.resume();

      addTimeEvent({
        sessionId: timerRef.current.sessionId,
        action: "start",
        time: timerRef.current.tickTime,
      });
    } else if (status === "running") {
      timerTick();

      timerRef.current.status = "paused";
      setStatus("paused");
      timerRef.current.accurateInterval?.pause();
      addTimeEvent({
        sessionId: timerRef.current.sessionId,
        action: "stop",
        time: timerRef.current.tickTime,
      });
    }
  };

  const stopStopwatch = () => {
    timerRef.current.status = "inactive";
    setStatus("inactive");
    timerRef.current.accurateInterval?.stop();

    addTimeEvent({
      sessionId: timerRef.current.sessionId,
      action: "stop",
      time: timerRef.current.tickTime,
    });
    markSessionAsCompleted(timerRef.current.sessionId);
  };

  const saveCurrentTimerState = useCallback(() => {
    if (isRestoringState.current) return;

    const elapsed = timerRef.current.tickTime - timerRef.current.startTime;

    saveTrackerState({
      type: "timer",
      status: timerRef.current.status,
      elapsedTime: elapsed,
      remainingTime: 0,
      time: timerRef.current.tickTime,
      sessionId: timerRef.current.sessionId,
    });
  }, []);

  const restoreTimerState = useCallback(() => {
    if (isRestoringState.current) return;
    isRestoringState.current = true;

    try {
      const savedState = getTrackerState();

      if (!savedState || savedState.status === "inactive") {
        timerRef.current.status = "inactive";
        setStatus("inactive");
        setTimeElapsed(0);
        timerRef.current.accurateInterval?.stop();
        isRestoringState.current = false;
        return;
      }

      timerRef.current.status = savedState.status;
      timerRef.current.startTime = savedState.time;
      timerRef.current.tickTime = savedState.time;
      timerRef.current.sessionId = savedState.sessionId;

      setStatus(savedState.status);
      setTimeElapsed(savedState.elapsedTime);

      if (savedState.status === "running") {
        const now = Date.now();
        const elapsed = now - savedState.time;

        timerRef.current.tickTime = now;
        setTimeElapsed(savedState.elapsedTime + elapsed);
        timerRef.current.accurateInterval?.resume();
      } else if (savedState.status === "paused") {
        timerRef.current.accurateInterval?.pause();
      }
    } finally {
      isRestoringState.current = false;
    }
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: string) => {
      if (nextAppState === "active") {
        restoreTimerState();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        if (timerRef.current.status === "running") {
          timerRef.current.accurateInterval?.pause();
        }
        saveCurrentTimerState();
      }
    },
    [restoreTimerState, saveCurrentTimerState],
  );

  useEffect(() => {
    restoreTimerState();

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    const accurateInterval = timerRef.current.accurateInterval;

    return () => {
      appStateSubscription.remove();
      accurateInterval?.stop();
    };
  }, [handleAppStateChange, restoreTimerState]);

  return {
    timeElapsed,
    status,
    startTimer: startStopwatch,
    togglePause,
    stopTimer: stopStopwatch,
  };
}
