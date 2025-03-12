export type TimeEvent = {
  id: string;
  action: "start" | "pause" | "resume" | "stop" | "complete";
  timestamp: number;
  duration: number;
  sessionId: string;
};

export type WorkSession = {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  completed: boolean;
  events: TimeEvent[];
};

const timeTrackingConfig = {
  storageKey: "minideep_work_sessions",
} as const;

export default timeTrackingConfig;
