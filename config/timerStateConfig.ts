export type TimerState = {
  state: "inactive" | "running" | "paused" | "completed";
  remainingTime: number;
  timestamp: number;
  sessionId: string;
};

const timerStateConfig = {
  storageKey: "dwt_timer_state",
} as const;

export default timerStateConfig;
