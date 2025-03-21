export type TimerState = {
  state: "inactive" | "running" | "paused" | "completed";
  remainingTime: number;
  initialDuration: number;
  date: Date;
  sessionId: string;
};

const timerStateConfig = {
  storageKey: "minideep_timer_state",
} as const;

export default timerStateConfig;
