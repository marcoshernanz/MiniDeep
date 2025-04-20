import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";

export default async function markSessionAsCompleted(sessionId: string) {
  const sessions = await getWorkSessions();
  const sessionIndex = sessions.findIndex(
    (session) => session.id === sessionId,
  );

  if (sessionIndex === -1) return;

  sessions[sessionIndex].isActive = false;

  await saveWorkSessions(sessions);
}
