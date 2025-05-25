import getTimeDistribution from "../time-tracking/getTimeDistribution";
import { startOfWeek } from "date-fns";

type WeeklyStatistics = {
  date: Date;
  time: number;
}[];

export default function getWeeklyStatistics(): WeeklyStatistics {
  const timeDistributions = getTimeDistribution();
  const weekMap = new Map<number, number>();

  for (const dist of timeDistributions) {
    const weekStart = startOfWeek(dist.date, { weekStartsOn: 1 });
    const weekKey = weekStart.getTime();
    const dayTotal = dist.distribution.reduce(
      (sum, hour) => sum + hour.time,
      0,
    );
    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + dayTotal);
  }

  return Array.from(weekMap.entries())
    .map(([date, time]) => ({ date: new Date(date), time }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
