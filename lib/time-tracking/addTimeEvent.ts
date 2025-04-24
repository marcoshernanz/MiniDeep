import { TimeEvent } from "@/zod/schemas/TimeEventSchema";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default async function addTimeEvent(
  sessionId: string,
  action: TimeEvent["action"],
): Promise<void> {
  const sessions = await getWorkSessions();
  const sessionIndex = sessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) return;

  const date = new Date();
  const session = sessions[sessionIndex];

  const newEvent: TimeEvent = {
    id: Date.now().toString(),
    action,
    sessionId,
    date,
  };

  const updatedSession = { ...session };
  updatedSession.events = [...updatedSession.events, newEvent];
  sessions[sessionIndex] = updatedSession;

  await saveWorkSessions(sessions);
}
