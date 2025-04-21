export type TimerStatus = "inactive" | "running" | "paused" | "completed";

export type TimerState = {
  status: TimerStatus;
  remainingTime: number;
  date: Date;
  sessionId: string;
};

const timerStateConfig = {
  storageKey: "minideep_timer_state",
} as const;

export default timerStateConfig;
