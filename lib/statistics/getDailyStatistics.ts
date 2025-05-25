import getTimeDistribution from "../time-tracking/getTimeDistribution";
import { startOfDay } from "date-fns";

type DailyStatistics = {
  date: Date;
  time: number;
}[];

export default function getDailyStatistics(): DailyStatistics {
  const timeDistributions = getTimeDistribution();

  return timeDistributions.map((dist) => ({
    date: startOfDay(dist.date),
    time: dist.distribution.reduce((sum, hour) => sum + hour.time, 0),
  }));
}
