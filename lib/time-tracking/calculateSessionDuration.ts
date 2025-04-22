import { WorkSession } from "@/zod/schemas/WorkSessionSchema";

export default function calculateSessionDuration(session: WorkSession): number {
  if (session.events.length < 2) {
    return 0;
  }

  let totalDuration = 0;
  for (let i = 0; i < session.events.length - 1; i++) {
    const startEvent = session.events[i];
    const endEvent = session.events[i + 1];

    if (startEvent.action === "start" && endEvent.action === "stop") {
      const duration = endEvent.date.getTime() - startEvent.date.getTime();
      totalDuration += duration;
    }
  }

  return totalDuration;
}
