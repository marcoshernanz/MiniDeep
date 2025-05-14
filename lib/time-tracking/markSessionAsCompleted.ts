import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default function markSessionAsCompleted(sessionId: string) {
  const sessions = getWorkSessions();
  const sessionIndex = sessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) return;

  sessions[sessionIndex].isActive = false;

  saveWorkSessions(sessions);
}
