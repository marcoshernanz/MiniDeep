type TimerCallback = () => void;

interface AccurateTimer {
  start: () => void;
  stop: () => void;
  isPaused: () => boolean;
  pause: () => void;
  resume: () => void;
}

export default function createAccurateTimer(
  callback: TimerCallback,
  interval: number = 1000,
): AccurateTimer {
  let expected: number = 0;
  let timeout: NodeJS.Timeout | null = null;
  let paused: boolean = true;

  const step = () => {
    const now = Date.now();
    const drift = now - expected;

    callback();

    expected += interval;

    if (drift > interval) {
      expected = now + interval;
    }

    if (!paused) {
      const wait = Math.max(0, interval - drift);
      timeout = setTimeout(step, wait);
    }
  };

  const start = () => {
    if (paused) {
      paused = false;
      expected = Date.now() + interval;
      timeout = setTimeout(step, interval);
    }
  };

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    paused = true;
  };

  const isPaused = () => paused;

  const pause = () => {
    if (!paused && timeout) {
      clearTimeout(timeout);
      timeout = null;
      paused = true;
    }
  };

  const resume = () => {
    if (paused) {
      paused = false;
      expected = Date.now() + interval;
      timeout = setTimeout(step, 0);
    }
  };

  return {
    start,
    stop,
    isPaused,
    pause,
    resume,
  };
}
