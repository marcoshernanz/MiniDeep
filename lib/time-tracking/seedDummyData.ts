import saveWorkSessions from "./saveWorkSessions";
import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import { v4 as uuidv4 } from "uuid";

// Generate a lot of dummy sessions for testing
const now = new Date();
const oneHour = 60 * 60 * 1000;
const sessions: WorkSession[] = [];

for (let i = 0; i < 100; i++) {
  const sessionId = uuidv4();
  const startDate = new Date(now.getTime() - (i + 1) * oneHour * 6);
  const plannedDuration = 60 * 60 * (1 + Math.floor(Math.random() * 3)); // 1-3 hours
  const isActive = false;
  const events = [
    {
      id: uuidv4(),
      sessionId,
      action: i % 2 === 0 ? "start" : "stop", // alternate for variety
      date: new Date(startDate),
    },
    {
      id: uuidv4(),
      sessionId,
      action: "stop",
      date: new Date(startDate.getTime() + plannedDuration * 1000),
    },
  ] as WorkSession["events"];
  sessions.push({
    id: sessionId,
    startDate,
    plannedDuration,
    isActive,
    events,
  });
}

export default async function seedDummyData() {
  await saveWorkSessions(sessions);
  // Optionally, you can log or alert success
}
