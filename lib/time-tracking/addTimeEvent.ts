import { TimeEvent } from "@/zod/schemas/TimeEventSchema";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

interface Params {
  sessionId: string;
  action: TimeEvent["action"];
  time: number;
}

export default async function addTimeEvent({
  sessionId,
  action,
  time,
}: Params): Promise<void> {
  const sessions = await getWorkSessions();
  const sessionIndex = sessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) return;

  const date = new Date(time);
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
