import { TimeEvent, WorkSession } from "@/config/timeTrackingConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "minideep_work_sessions";

// Function to generate a random duration between min and max minutes
const randomDuration = (minMinutes: number, maxMinutes: number): number => {
  return (
    Math.floor(Math.random() * (maxMinutes - minMinutes + 1) + minMinutes) * 60
  );
};

// Function to create a timestamp for a specific day with random hour
const createTimestamp = (daysAgo: number, hour?: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour || Math.floor(Math.random() * 12) + 8); // Between 8am and 8pm if not specified
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(0);
  return date.getTime();
};

// Generate a completed session
const generateCompletedSession = (daysAgo: number): WorkSession => {
  const duration = randomDuration(25, 90); // Between 25-90 minutes
  const startTime = createTimestamp(daysAgo);
  const endTime = startTime + duration * 1000;
  const sessionId = `demo-${startTime}`;

  const events: TimeEvent[] = [];

  // Add start event
  events.push({
    id: `${sessionId}-start`,
    action: "start",
    timestamp: startTime,
    duration,
    sessionId,
  });

  // Maybe add some pause/resume events
  if (Math.random() > 0.5) {
    const pauseTime = startTime + Math.floor(duration * 0.3) * 1000;
    const resumeTime = pauseTime + 5 * 60 * 1000; // 5 minute pause

    events.push({
      id: `${sessionId}-pause`,
      action: "pause",
      timestamp: pauseTime,
      duration: Math.floor((pauseTime - startTime) / 1000),
      sessionId,
    });

    events.push({
      id: `${sessionId}-resume`,
      action: "resume",
      timestamp: resumeTime,
      duration: Math.floor((endTime - resumeTime) / 1000),
      sessionId,
    });
  }

  // Add complete event
  events.push({
    id: `${sessionId}-complete`,
    action: "complete",
    timestamp: endTime,
    duration,
    sessionId,
  });

  return {
    id: sessionId,
    startTime,
    endTime,
    duration,
    completed: true,
    events,
  };
};

// Generate a stopped session (not completed)
const generateStoppedSession = (daysAgo: number): WorkSession => {
  const plannedDuration = randomDuration(30, 120);
  const actualDuration = Math.floor(
    plannedDuration * (Math.random() * 0.8 + 0.1),
  ); // 10-90% of planned
  const startTime = createTimestamp(daysAgo);
  const endTime = startTime + actualDuration * 1000;
  const sessionId = `demo-${startTime}`;

  const events: TimeEvent[] = [];

  // Add start event
  events.push({
    id: `${sessionId}-start`,
    action: "start",
    timestamp: startTime,
    duration: plannedDuration,
    sessionId,
  });

  // Add stop event
  events.push({
    id: `${sessionId}-stop`,
    action: "stop",
    timestamp: endTime,
    duration: actualDuration,
    sessionId,
  });

  return {
    id: sessionId,
    startTime,
    endTime,
    duration: plannedDuration,
    completed: false,
    events,
  };
};

// Generate a set of sessions from the last 14 days
const generateDummySessions = (): WorkSession[] => {
  const sessions: WorkSession[] = [];

  // Last 14 days
  for (let i = 14; i >= 0; i--) {
    // Skip some days randomly
    if (Math.random() < 0.3 && i !== 0) continue;

    // Generate 1-3 sessions per day
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < sessionsPerDay; j++) {
      // 70% complete, 30% stopped
      if (Math.random() < 0.7) {
        sessions.push(generateCompletedSession(i));
      } else {
        sessions.push(generateStoppedSession(i));
      }
    }
  }

  return sessions;
};

// Load dummy data into AsyncStorage
export const loadDummyData = async (): Promise<void> => {
  const dummySessions = generateDummySessions();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dummySessions));
    console.log(`Loaded ${dummySessions.length} dummy sessions`);
  } catch (error) {
    console.error("Failed to load dummy data:", error);
  }
};
