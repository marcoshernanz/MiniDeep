import { TimeEvent } from "@/config/timeTrackingConfig";
import getWorkSessions from "./getWorkSessions";
import saveWorkSessions from "./saveWorkSessions";
import saveTimerState from "../timer/saveTimerState";
import { TimerState } from "@/config/timerStateConfig";

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

  const timestamp = Date.now();
  const session = sessions[sessionIndex];

  const newEvent: TimeEvent = {
    id: Date.now().toString(),
    action,
    timestamp,
    duration,
    sessionId,
  };

  const updatedSession = { ...session };
  updatedSession.events = [...updatedSession.events, newEvent];

  if (action === "complete" || action === "stop") {
    updatedSession.endTime = timestamp;
    updatedSession.completed = action === "complete";
  }

  sessions[sessionIndex] = updatedSession;

  let state: TimerState["state"] = "inactive";
  if (action === "start" || action === "resume") {
    state = "running";
  } else if (action === "pause") {
    state = "paused";
  } else if (action === "complete") {
    state = "completed";
  } else if (action === "stop") {
    state = "inactive";
  }

  const timerState: TimerState = {
    state,
    remainingTime: duration,
    initialDuration: action === "start" ? duration : session.duration,
    timestamp,
    sessionId,
  };

  await Promise.all([saveWorkSessions(sessions), saveTimerState(timerState)]);
}
