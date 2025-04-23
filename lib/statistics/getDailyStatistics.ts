import getTimeDistribution from "../time-tracking/getTimeDistribution";
import { startOfDay } from "date-fns";

type DailyStatistics = {
  date: Date;
  time: number;
}[];

export default async function getDailyStatistics(): Promise<DailyStatistics> {
  const timeDistributions = await getTimeDistribution();

  return timeDistributions.map((dist) => ({
    date: startOfDay(dist.date),
    time: dist.distribution.reduce((sum, hour) => sum + hour.time, 0),
  }));
}
