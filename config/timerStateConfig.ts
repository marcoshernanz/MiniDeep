export type TimerState = {
  state: "inactive" | "running" | "paused" | "completed";
  remainingTime: number;
  initialDuration: number;
  timestamp: number;
  sessionId: string;
};

const timerStateConfig = {
  storageKey: "minideep_timer_state",
} as const;

export default timerStateConfig;
