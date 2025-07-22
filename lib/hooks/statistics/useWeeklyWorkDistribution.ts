import useDailyWorkDistribution from "@/lib/hooks/statistics/useDailyWorkDistribution";
import { useMemo } from "react";
import { startOfWeek, addWeeks, format, parseISO } from "date-fns";

export default function useWeeklyWorkDistribution(): Record<string, number> {
  const daily = useDailyWorkDistribution();
  return useMemo(() => {
    const dayKeys = Object.keys(daily);

    if (dayKeys.length === 0) return {};

    const sortedDays = [...dayKeys].sort();

    const firstWeek = startOfWeek(parseISO(sortedDays[0]), { weekStartsOn: 1 });
    const lastWeek = startOfWeek(parseISO(sortedDays[sortedDays.length - 1]), {
      weekStartsOn: 1,
    });

    const distribution: Record<string, number> = {};
    for (
      let cursor = firstWeek;
      cursor.getTime() <= lastWeek.getTime();
      cursor = addWeeks(cursor, 1)
    ) {
      const weekKey = format(cursor, "yyyy-MM-dd");
      distribution[weekKey] = 0;
    }

    dayKeys.forEach((dayKey) => {
      const date = parseISO(dayKey);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekKey = format(weekStart, "yyyy-MM-dd");
      if (distribution[weekKey] != null) {
        distribution[weekKey] += daily[dayKey];
      }
    });
    return distribution;
  }, [daily]);
}
