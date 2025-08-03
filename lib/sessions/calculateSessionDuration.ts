import { WorkSession } from "@/zod/schemas/WorkSessionSchema";

export default function calculateSessionDuration(
  session: WorkSession,
  now: number = Date.now()
): number {
  let totalDuration = 0;
  if (session.type === "timer") {
    for (const event of session.events) {
      const { start, stop } = event;
      if (stop) {
        totalDuration += stop.getTime() - start.getTime();
      } else {
        totalDuration += now - start.getTime();
      }
    }

    totalDuration = Math.min(totalDuration, session.inputDuration);
  } else if (session.type === "stopwatch") {
    for (const interval of session.intervals) {
      const { start, end } = interval;
      if (end) {
        totalDuration += end.getTime() - start.getTime();
      } else {
        totalDuration += now - start.getTime();
      }
    }
  }
  return totalDuration;
}
