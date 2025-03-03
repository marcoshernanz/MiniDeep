import { TimeEvent } from "@/config/timeTrackingConfig";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default async function addTimeEvent(
  sessionId: string,
  action: TimeEvent["action"],
  duration: number,
): Promise<void> {
  const sessions = await getWorkSessions();
  const sessionIndex = sessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) return;

  const newEvent: TimeEvent = {
    id: Date.now().toString(),
    action,
    timestamp: Date.now(),
    duration,
    sessionId,
  };

  const updatedSession = { ...sessions[sessionIndex] };
  updatedSession.events = [...updatedSession.events, newEvent];

  if (action === "complete" || action === "stop") {
    updatedSession.endTime = Date.now();
    updatedSession.completed = action === "complete";
  }

  sessions[sessionIndex] = updatedSession;
  await saveWorkSessions(sessions);
}
