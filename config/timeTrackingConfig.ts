export type TimeEvent = {
  id: string;
  action: "start" | "pause" | "resume" | "stop" | "complete";
  date: Date;
  duration: number;
  sessionId: string;
};

export type WorkSession = {
  id: string;
  startDate: Date;
  endDate: Date | null;
  duration: number;
  completed: boolean;
  events: TimeEvent[];
};

const timeTrackingConfig = {
  storageKey: "minideep_work_sessions",
} as const;

export default timeTrackingConfig;
