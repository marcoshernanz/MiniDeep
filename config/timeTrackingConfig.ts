export type TimeEvent = {
  id: string;
  sessionId: string;
  action: "start" | "stop";
  date: Date;
};

export type WorkSession = {
  id: string;
  plannedDuration: number;
  isActive: boolean;
  events: TimeEvent[];
};

const timeTrackingConfig = {
  storageKey: "minideep_work_sessions",
} as const;

export default timeTrackingConfig;
