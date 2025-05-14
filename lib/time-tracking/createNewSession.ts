import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

interface Params {
  type: "timer" | "stopwatch";
  duration: number;
  startTime: number;
}

export default function createNewSession({
  type,
  duration,
  startTime,
}: Params): string {
  const sessionId = Date.now().toString();
  const newSession: WorkSession = {
    id: sessionId,
    type,
    startDate: new Date(startTime),
    plannedDuration: duration,
    isActive: true,
    events: [],
  };

  const sessions = getWorkSessions();
  saveWorkSessions([...sessions, newSession]);

  return sessionId;
}
