import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

interface Params {
  duration: number;
  startTime: number;
}

export default async function createNewSession({
  duration,
  startTime,
}: Params): Promise<string> {
  const sessionId = Date.now().toString();
  const newSession: WorkSession = {
    id: sessionId,
    startDate: new Date(startTime),
    plannedDuration: duration,
    isActive: true,
    events: [],
  };

  const sessions = await getWorkSessions();
  await saveWorkSessions([...sessions, newSession]);

  return sessionId;
}
