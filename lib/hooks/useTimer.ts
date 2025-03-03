import { useState, useEffect, useRef } from "react";
import createAccurateTimer from "../utils/createAccurateTimer";
import { createNewSession, addTimeEvent } from "../utils/timeTracking";

export default function useTimer() {
  const [displayTime, setDisplayTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [status, setStatus] = useState({
    isRunning: false,
    isPaused: false,
    isCompleted: false,
  });

  const timerRef = useRef({
    totalSeconds: 0,
    accurateTimer: null as ReturnType<typeof createAccurateTimer> | null,
    sessionId: "",
    initialDuration: 0,
  });

  const updateTimeRemaining = () => {
    const totalSecondsLeft = timerRef.current.totalSeconds;

    if (totalSecondsLeft <= 0) {
      if (timerRef.current.accurateTimer) {
        timerRef.current.accurateTimer.stop();
      }
      timerRef.current.totalSeconds = 0;
      setStatus((prev) => ({ ...prev, isCompleted: true }));

      if (timerRef.current.sessionId) {
        addTimeEvent(
          timerRef.current.sessionId,
          "complete",
          timerRef.current.initialDuration,
        );
      }
    }

    const hours = Math.floor(totalSecondsLeft / 3600);
    const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
    const seconds = totalSecondsLeft % 60;

    setDisplayTime({
      hours,
      minutes,
      seconds,
    });
  };

  const timerTick = () => {
    if (timerRef.current.totalSeconds > 0) {
      timerRef.current.totalSeconds -= 1;
      updateTimeRemaining();
    }
  };

  const startTimer = async ({
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timerRef.current.totalSeconds = totalSeconds;
    timerRef.current.initialDuration = totalSeconds;

    if (timerRef.current.accurateTimer) {
      timerRef.current.accurateTimer.stop();
    }
    timerRef.current.accurateTimer = createAccurateTimer(timerTick, 1000);

    setDisplayTime({
      hours,
      minutes,
      seconds,
    });

    setStatus({
      isRunning: true,
      isPaused: false,
      isCompleted: false,
    });

    const sessionId = await createNewSession(totalSeconds);
    timerRef.current.sessionId = sessionId;

    await addTimeEvent(sessionId, "start", totalSeconds);

    timerRef.current.accurateTimer.start();
  };

  const togglePause = async () => {
    if (!timerRef.current.accurateTimer) return;

    const remainingTime = timerRef.current.totalSeconds;

    if (status.isPaused) {
      timerRef.current.accurateTimer.resume();
      await addTimeEvent(timerRef.current.sessionId, "resume", remainingTime);
    } else {
      timerRef.current.accurateTimer.pause();
      await addTimeEvent(timerRef.current.sessionId, "pause", remainingTime);
    }

    setStatus((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const stopTimer = async () => {
    if (timerRef.current.accurateTimer) {
      timerRef.current.accurateTimer.stop();
      timerRef.current.accurateTimer = null;

      const remainingTime = timerRef.current.totalSeconds;
      const elapsedTime = timerRef.current.initialDuration - remainingTime;
      await addTimeEvent(timerRef.current.sessionId, "stop", elapsedTime);
    }

    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });

    setDisplayTime({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current.accurateTimer) {
        timerRef.current.accurateTimer.stop();
      }
    };
  }, []);

  return {
    hours: displayTime.hours,
    minutes: displayTime.minutes,
    seconds: displayTime.seconds,
    isRunning: status.isRunning,
    isPaused: status.isPaused,
    isCompleted: status.isCompleted,
    startTimer,
    togglePause,
    stopTimer,
  };
}
