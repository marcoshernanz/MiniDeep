import { useState } from "react";

interface UseCountdownProps {
  duration: number;
  onComplete?: (hasFinished: boolean) => void;
}

export function useCountdown({ duration, onComplete }: UseCountdownProps) {
  const [timer, setTimer] = useState<{
    start: Date;
    duration: number;
    elapsed: number;
  } | null>(null);

  const [isActive, setIsActive] = useState(false);

  const start = () => {
    setIsActive(true);

    setTimer((timer) => {
      if (!timer) {
        return {
          start: new Date(),
          duration,
          elapsed: 0,
        };
      }

      return {
        ...timer,
        start: new Date(),
      };
    });
  };

  const pause = () => {
    if (!isActive) return;

    setIsActive(false);

    setTimer((timer) => {
      if (!timer) return null;

      return {
        ...timer,
        elapsed: new Date().getTime() - timer.start.getTime(),
      };
    });
  };

  const resume = () => {
    if (isActive) return;

    setIsActive(true);

    setTimer((timer) => {
      if (!timer) return null;

      return {
        ...timer,
        start: new Date(),
      };
    });
  };

  const stop = () => {
    setIsActive(false);
  };

  return {
    timer,
    start,
    pause,
    resume,
    stop,
  };
}
