import getDailyStatistics from "@/lib/statistics/getDailyStatistics";
import getMonthlyStatistics from "@/lib/statistics/getMonthlyStatistics";
import getWeeklyStatistics from "@/lib/statistics/getWeeklyStatistics";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DeviceEventEmitter } from "react-native";

export type StatisticsTimeFrame = "1W" | "1M" | "3M" | "1Y" | "All";
export const statisticsTimeFrames: StatisticsTimeFrame[] = [
  "1W",
  "1M",
  "3M",
  "1Y",
  "All",
];

interface StatisticsContextValue {
  timeFrame: StatisticsTimeFrame;
  setTimeFrame: (timeFrame: StatisticsTimeFrame) => void;
  statistics: { date: string; time: number }[];
  numDotsVisible: number;
}

export const StatisticsContext = createContext<StatisticsContextValue>({
  timeFrame: "1W",
  setTimeFrame: () => {},
  statistics: [],
  numDotsVisible: 0,
});

interface Props {
  children: React.ReactNode;
}

export default function StatisticsContextProvider({ children }: Props) {
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

  const loadStatistics = useCallback(() => {
    let statisticsData: { date: Date; time: number }[] = [];

    if (timeFrame === "1W") {
      statisticsData = getDailyStatistics();
    } else if (timeFrame === "1M") {
      statisticsData = getDailyStatistics();
    } else if (timeFrame === "3M") {
      statisticsData = getWeeklyStatistics();
    } else if (timeFrame === "1Y") {
      statisticsData = getMonthlyStatistics();
    } else if (timeFrame === "All") {
      statisticsData = getMonthlyStatistics();
    }

    const formattedStatistics = statisticsData.map((stat) => ({
      date: stat.date.toISOString(),
      time: stat.time,
    }));

    const MAX_DOTS = 100;
    const recentStats =
      formattedStatistics.length > MAX_DOTS
        ? formattedStatistics.slice(formattedStatistics.length - MAX_DOTS)
        : formattedStatistics;

    setStatistics(recentStats);
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
  return (
    <StatisticsContext.Provider
      value={{
        timeFrame,
        setTimeFrame,
        statistics,
        numDotsVisible,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatisticsContext() {
  return useContext(StatisticsContext);
}
