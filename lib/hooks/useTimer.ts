import { useState, useEffect, useRef } from "react";

export default function useTimer() {
  const [status, setStatus] = useState({
    isRunning: false,
    isPaused: false,
    isCompleted: false,
  });

  const timerRef = useRef({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  const startTimer = ({
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    timerRef.current = {
      hours,
      minutes,
      seconds,
      totalSeconds,
    };

    setStatus({
      isRunning: true,
      isPaused: false,
      isCompleted: false,
    });
  };

  const togglePause = () => {
    setStatus((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const stopTimer = () => {
    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });
  };

  const getTimeRemaining = () => {
    const totalSecondsLeft = timerRef.current.totalSeconds;

    const hours = Math.floor(totalSecondsLeft / 3600);
    const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
    const seconds = totalSecondsLeft % 60;

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (status.isRunning && !status.isPaused && !status.isCompleted) {
      intervalId = setInterval(() => {
        timerRef.current.totalSeconds -= 1;

        if (timerRef.current.totalSeconds <= 0) {
          clearInterval(intervalId!);
          timerRef.current.totalSeconds = 0;
          setStatus((prev) => ({ ...prev, isCompleted: true }));
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status.isRunning, status.isPaused, status.isCompleted]);

  return {
    ...getTimeRemaining(),
    isRunning: status.isRunning,
    isPaused: status.isPaused,
    isCompleted: status.isCompleted,
    startTimer,
    togglePause,
    stopTimer,
  };
}
