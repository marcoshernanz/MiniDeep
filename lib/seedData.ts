import {
  eachDayOfInterval,
  startOfDay,
  addYears,
  set,
  addMinutes,
} from "date-fns";
import timeTrackingConfig from "@/config/timeTrackingConfig";
import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import { TimeEvent } from "@/zod/schemas/TimeEventSchema";
import { storage } from "@/lib/storage/mmkv";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function seedWorkSessions(): void {
  const { storageKey } = timeTrackingConfig;
  const today = startOfDay(new Date());
  const startDate = addYears(today, -2);
  const dates = eachDayOfInterval({ start: startDate, end: today });

  const sessions: WorkSession[] = dates.map((date) => {
    const base = set(date, {
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const startOffset = getRandomInt(-30, 30);
    const sessionStart = addMinutes(base, startOffset);
    const actualDuration = getRandomInt(30, 120);
    const plannedOffset = getRandomInt(-15, 15);
    const plannedDurationMinutes = Math.max(15, actualDuration + plannedOffset);
    const plannedDuration = plannedDurationMinutes * 60 * 1000;
    const sessionEnd = addMinutes(sessionStart, actualDuration);

    const sessionId = sessionStart.getTime().toString();

    const events: TimeEvent[] = [
      {
        id: `${sessionId}-start`,
        sessionId,
        action: "start",
        date: sessionStart,
      },
      { id: `${sessionId}-stop`, sessionId, action: "stop", date: sessionEnd },
    ];

    return {
      id: sessionId,
      startDate: sessionStart,
      plannedDuration,
      isActive: false,
      events,
    };
  });

  storage.set(storageKey, JSON.stringify(sessions));
}

export function clearWorkSessions(): void {
  const { storageKey } = timeTrackingConfig;
  storage.delete(storageKey);
}
