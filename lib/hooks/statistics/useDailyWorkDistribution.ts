import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";
import { eachDayOfInterval, startOfDay, addDays, format } from "date-fns";

export default function useDailyWorkDistribution(): Record<string, number> {
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
    const lastDay = startOfDay(intervals[intervals.length - 1].end);
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });

    const distribution: Record<string, number> = {};
    days.forEach((day) => {
      const dayKey = format(day, "yyyy-MM-dd");
      distribution[dayKey] = 0;
    });

    intervals.forEach(({ start, end }) => {
      let cursor = new Date(start);
      const endTime = end.getTime();

      while (cursor.getTime() < endTime) {
        const dayStart = startOfDay(cursor);
        const dayKey = format(dayStart, "yyyy-MM-dd");
        const nextDayBoundary = addDays(dayStart, 1);
        const segmentEnd =
          nextDayBoundary.getTime() < endTime ? nextDayBoundary : end;
        const delta = segmentEnd.getTime() - cursor.getTime();
        if (distribution[dayKey] != null) {
          distribution[dayKey] += delta;
        }
        cursor = segmentEnd;
      }
    });

    return distribution;
  }, [appData.sessions]);
}
