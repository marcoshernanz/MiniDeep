import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";
import {
  eachDayOfInterval,
  startOfDay,
  startOfHour,
  addHours,
  format,
} from "date-fns";

export default function useHourlyWorkDistribution(): Record<
  string,
  Record<string, number>
> {
  const { appData } = useAppContext();

  return useMemo(() => {
    const intervals = appData.sessions
      .flatMap((session) =>
        session.type === "timer"
          ? session.events.map(({ start, stop: end }) => ({ start, end }))
          : session.intervals
      )
      .filter(({ end }) => end != null) as { start: Date; end: Date }[];

    if (intervals.length === 0) {
      return {};
    }

    intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

    const firstDay = startOfDay(intervals[0].start);
    const lastDay = startOfDay(new Date());

    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    const distribution: Record<string, Record<string, number>> = {};
    days.forEach((day) => {
      const dayKey = format(day, "yyyy-MM-dd");
      distribution[dayKey] = {};
      for (let hour = 0; hour < 24; hour++) {
        const hourKey = `${String(hour).padStart(2, "0")}:00`;
        distribution[dayKey][hourKey] = 0;
      }
    });

    intervals.forEach(({ start, end }) => {
      let cursor = new Date(start);
      const endTime = end.getTime();

      while (cursor.getTime() < endTime) {
        const dayKey = format(startOfDay(cursor), "yyyy-MM-dd");
        const hourKey = `${String(cursor.getHours()).padStart(2, "0")}:00`;

        const nextHour = addHours(startOfHour(cursor), 1);
        const segmentEnd = nextHour.getTime() < endTime ? nextHour : end;
        const delta = segmentEnd.getTime() - cursor.getTime();

        if (distribution[dayKey] && distribution[dayKey][hourKey] != null) {
          distribution[dayKey][hourKey] += delta;
        }
        cursor = segmentEnd;
      }
    });
    return distribution;
  }, [appData.sessions]);
}
