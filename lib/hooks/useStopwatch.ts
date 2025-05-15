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

  const stopwatchRef = useRef({
    accurateInterval: null as ReturnType<typeof createAccurateInterval> | null,
    status: "inactive" as TrackerState["status"],
    sessionId: "",
    startTime: 0,
    totalTimeElapsed: 0,
    tickTime: 0,
  });
  const isRestoringState = useRef(false);

  const stopwatchTick = useCallback(() => {
    if (stopwatchRef.current.status !== "running") return;

    const now = Date.now();
    const elapsed = now - stopwatchRef.current.startTime;
    setTimeElapsed(elapsed + stopwatchRef.current.totalTimeElapsed);
    stopwatchRef.current.tickTime = now;
  }, []);

  if (!stopwatchRef.current.accurateInterval) {
    stopwatchRef.current.accurateInterval = createAccurateInterval(
      stopwatchTick,
      250,
    );
  }

  const startStopwatch = () => {
    const now = Date.now();

    stopwatchRef.current.startTime = now;
    stopwatchRef.current.totalTimeElapsed = 0;
    stopwatchRef.current.tickTime = now;

    stopwatchRef.current.status = "running";
    setStatus("running");
    setTimeElapsed(0);
    stopwatchRef.current.accurateInterval?.start();

    const createdSessionId = createNewSession({
      type: "stopwatch",
      duration: 0,
      startTime: now,
    });
    stopwatchRef.current.sessionId = createdSessionId;

    addTimeEvent({
      sessionId: stopwatchRef.current.sessionId,
      action: "start",
      time: stopwatchRef.current.tickTime,
    });
  };

  const togglePause = () => {
    if (status === "paused") {
      const now = Date.now();

      stopwatchRef.current.startTime = now;
      stopwatchRef.current.tickTime = now;

      stopwatchRef.current.status = "running";
      setStatus("running");

      stopwatchRef.current.accurateInterval?.resume();

      addTimeEvent({
        sessionId: stopwatchRef.current.sessionId,
        action: "start",
        time: stopwatchRef.current.tickTime,
      });
    } else if (status === "running") {
      stopwatchTick();

      stopwatchRef.current.status = "paused";
      setStatus("paused");

      const elapsed =
        stopwatchRef.current.tickTime - stopwatchRef.current.startTime;
      stopwatchRef.current.totalTimeElapsed += elapsed;
      setTimeElapsed(stopwatchRef.current.totalTimeElapsed);

      stopwatchRef.current.accurateInterval?.pause();
      addTimeEvent({
        sessionId: stopwatchRef.current.sessionId,
        action: "stop",
        time: stopwatchRef.current.tickTime,
      });
    }
  };

  const stopStopwatch = () => {
    stopwatchRef.current.status = "inactive";
    setStatus("inactive");
    stopwatchRef.current.accurateInterval?.stop();

    addTimeEvent({
      sessionId: stopwatchRef.current.sessionId,
      action: "stop",
      time: stopwatchRef.current.tickTime,
    });
    markSessionAsCompleted(stopwatchRef.current.sessionId);
  };

  const saveCurrentStopwatchState = useCallback(() => {
    if (isRestoringState.current) return;

    const elapsed =
      stopwatchRef.current.tickTime - stopwatchRef.current.startTime;
    stopwatchRef.current.totalTimeElapsed += elapsed;

    saveTrackerState({
      type: "stopwatch",
      status: stopwatchRef.current.status,
      elapsedTime: stopwatchRef.current.totalTimeElapsed,
      remainingTime: 0,
      time: stopwatchRef.current.tickTime,
      sessionId: stopwatchRef.current.sessionId,
    });
  }, []);

  const restoreStopwatchState = useCallback(() => {
    if (isRestoringState.current) return;
    isRestoringState.current = true;

    try {
      const savedState = getTrackerState();

      if (!savedState || savedState.status === "inactive") {
        stopwatchRef.current.status = "inactive";
        setStatus("inactive");
        setTimeElapsed(0);
        stopwatchRef.current.accurateInterval?.stop();
        isRestoringState.current = false;
        return;
      }

      stopwatchRef.current.status = savedState.status;
      stopwatchRef.current.startTime = savedState.time;
      stopwatchRef.current.totalTimeElapsed = savedState.elapsedTime;
      stopwatchRef.current.tickTime = savedState.time;
      stopwatchRef.current.sessionId = savedState.sessionId;

      setStatus(savedState.status);
      setTimeElapsed(savedState.elapsedTime);

      if (savedState.status === "running") {
        const now = Date.now();
        const elapsed = now - savedState.time;

        stopwatchRef.current.tickTime = now;
        setTimeElapsed(savedState.elapsedTime + elapsed);
        stopwatchRef.current.accurateInterval?.resume();
      } else if (savedState.status === "paused") {
        stopwatchRef.current.accurateInterval?.pause();
      }
    } finally {
      isRestoringState.current = false;
    }
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: string) => {
      if (nextAppState === "active") {
        restoreStopwatchState();
      }
    },
    [restoreStopwatchState],
  );

  useEffect(() => {
    restoreStopwatchState();

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    const accurateInterval = stopwatchRef.current.accurateInterval;

    return () => {
      appStateSubscription.remove();
      accurateInterval?.stop();
    };
  }, [handleAppStateChange, restoreStopwatchState]);

  return {
    timeElapsed,
    status,
    startStopwatch,
    togglePause,
    stopStopwatch,
    saveCurrentStopwatchState,
  };
}
