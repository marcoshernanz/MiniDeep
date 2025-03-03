import AsyncStorage from "@react-native-async-storage/async-storage";

export type TimeEvent = {
  id: string;
  action: "start" | "pause" | "resume" | "stop" | "complete";
  timestamp: number;
  duration: number; // Duration in seconds
  sessionId: string;
};

export type WorkSession = {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number; // Total working duration in seconds
  completed: boolean;
  events: TimeEvent[];
};

const STORAGE_KEY = "dwt_work_sessions";

export const getWorkSessions = async (): Promise<WorkSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading work sessions:", error);
    return [];
  }
};

export const saveWorkSessions = async (
  sessions: WorkSession[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving work sessions:", error);
  }
};

export const createNewSession = async (
  totalDuration: number,
): Promise<string> => {
  const sessionId = Date.now().toString();
  const newSession: WorkSession = {
    id: sessionId,
    startTime: Date.now(),
    endTime: null,
    duration: totalDuration,
    completed: false,
    events: [],
  };

  const sessions = await getWorkSessions();
  await saveWorkSessions([...sessions, newSession]);
  return sessionId;
};

export const addTimeEvent = async (
  sessionId: string,
  action: TimeEvent["action"],
  duration: number,
): Promise<void> => {
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

  // Update session status based on action
  if (action === "complete" || action === "stop") {
    updatedSession.endTime = Date.now();
    updatedSession.completed = action === "complete";
  }

  sessions[sessionIndex] = updatedSession;
  await saveWorkSessions(sessions);
};
