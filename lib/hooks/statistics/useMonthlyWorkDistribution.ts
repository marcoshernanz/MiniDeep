import useDailyWorkDistribution from "@/lib/hooks/statistics/useDailyWorkDistribution";
import { useMemo } from "react";
import {
  startOfMonth,
  addMonths,
  format,
  parseISO,
  getDaysInMonth,
} from "date-fns";

export default function useMonthlyWorkDistribution(): Record<string, number> {
  const daily = useDailyWorkDistribution();
  return useMemo(() => {
    const dayKeys = Object.keys(daily);
    if (dayKeys.length === 0) return {};

    const sortedDays = [...dayKeys].sort();
    const firstMonth = startOfMonth(parseISO(sortedDays[0]));
    const lastMonth = startOfMonth(parseISO(sortedDays[sortedDays.length - 1]));
    const distribution: Record<string, number> = {};

    for (
      let cursor = firstMonth;
      cursor.getTime() <= lastMonth.getTime();
      cursor = addMonths(cursor, 1)
    ) {
      const monthKey = format(cursor, "yyyy-MM-dd");
      distribution[monthKey] = 0;
    }

    dayKeys.forEach((dayKey) => {
      const date = parseISO(dayKey);
      const monthStart = startOfMonth(date);
      const monthKey = format(monthStart, "yyyy-MM-dd");
      if (distribution[monthKey] != null) {
        distribution[monthKey] += daily[dayKey];
      }
    });

    Object.keys(distribution).forEach((monthKey) => {
      const daysCount = getDaysInMonth(parseISO(monthKey));
      distribution[monthKey] = distribution[monthKey] / daysCount;
    });
    return distribution;
  }, [daily]);
}
