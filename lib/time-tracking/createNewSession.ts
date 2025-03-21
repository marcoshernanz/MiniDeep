import { WorkSession } from "@/config/timeTrackingConfig";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default async function createNewSession(
  totalDuration: number,
): Promise<string> {
  const sessionId = Date.now().toString();
  const newSession: WorkSession = {
    id: sessionId,
    startDate: new Date(),
    endDate: null,
    duration: totalDuration,
    completed: false,
    events: [],
  };

  const sessions = await getWorkSessions();
  await saveWorkSessions([...sessions, newSession]);
  return sessionId;
}
