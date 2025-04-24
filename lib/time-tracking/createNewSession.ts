import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default async function createNewSession(
  totalDuration: number,
): Promise<string> {
  const sessionId = Date.now().toString();
  const newSession: WorkSession = {
    id: sessionId,
    startDate: new Date(),
    plannedDuration: totalDuration,
    isActive: true,
    events: [],
  };

  const sessions = await getWorkSessions();
  await saveWorkSessions([...sessions, newSession]);

  return sessionId;
}
