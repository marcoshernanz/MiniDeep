import getTimeDistribution from "../time-tracking/getTimeDistribution";
import { startOfMonth } from "date-fns";

type MonthlyStatistics = {
  date: Date;
  time: number;
}[];

export default async function getMonthlyStatistics(): Promise<MonthlyStatistics> {
  const timeDistributions = await getTimeDistribution();
  const monthMap = new Map<number, number>();

  for (const dist of timeDistributions) {
    const monthStart = startOfMonth(dist.date);
    const monthKey = monthStart.getTime();
    const dayTotal = dist.distribution.reduce(
      (sum, hour) => sum + hour.time,
      0,
    );
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + dayTotal);
  }

  return Array.from(monthMap.entries())
    .map(([date, time]) => ({ date: new Date(date), time }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
