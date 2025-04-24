import { useCallback, useEffect, useState } from "react";
import getDailyStatistics from "../statistics/getDailyStatistics";
import getWeeklyStatistics from "../statistics/getWeeklyStatistics";
import getMonthlyStatistics from "../statistics/getMonthlyStatistics";
import { DeviceEventEmitter } from "react-native";

export type StatisticsTimeFrame = "1W" | "1M" | "3M" | "1Y" | "All";
export const statisticsTimeFrames: StatisticsTimeFrame[] = [
  "1W",
  "1M",
  "3M",
  "1Y",
  "All",
];

export default function useStatistics() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<
    { date: string; time: number }[]
  >([]);
  const [timeFrame, setTimeFrame] = useState<StatisticsTimeFrame>("1W");

  let numDotsVisible = 0;
  if (timeFrame === "1W") {
    numDotsVisible = 7;
  } else if (timeFrame === "1M") {
    numDotsVisible = 30;
  } else if (timeFrame === "3M") {
    numDotsVisible = 12;
  } else if (timeFrame === "1Y") {
    numDotsVisible = 12;
  } else if (timeFrame === "All") {
    numDotsVisible = Math.max(2, statistics.length);
  }

  const loadStatistics = useCallback(async () => {
    setLoading(true);

    let statisticsData: { date: Date; time: number }[] = [];

    if (timeFrame === "1W") {
      statisticsData = await getDailyStatistics();
    } else if (timeFrame === "1M") {
      statisticsData = await getDailyStatistics();
    } else if (timeFrame === "3M") {
      statisticsData = await getWeeklyStatistics();
    } else if (timeFrame === "1Y") {
      statisticsData = await getMonthlyStatistics();
    } else if (timeFrame === "All") {
      statisticsData = await getMonthlyStatistics();
    }

    const formattedStatistics = statisticsData.map((stat) => ({
      date: stat.date.toISOString(),
      time: stat.time,
    }));

    setStatistics(formattedStatistics);
    setLoading(false);
  }, [timeFrame]);

  useEffect(() => {
    loadStatistics();
    const subscription = DeviceEventEmitter.addListener(
      "sessionsChanged",
      loadStatistics,
    );
    return () => {
      subscription.remove();
    };
  }, [loadStatistics]);

  return {
    loading,
    statistics,
    numDotsVisible,
    timeFrame,
    setTimeFrame,
    refresh: loadStatistics,
  };
}
