import useChart from "@/lib/hooks/useChart";
import getDailyStatistics from "@/lib/statistics/getDailyStatistics";
import getMonthlyStatistics from "@/lib/statistics/getMonthlyStatistics";
import getWeeklyStatistics from "@/lib/statistics/getWeeklyStatistics";
import { format } from "date-fns";
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DeviceEventEmitter, View } from "react-native";

export type StatisticsTimeFrame = "1W" | "1M" | "3M" | "1Y" | "All";
export const statisticsTimeFrames: StatisticsTimeFrame[] = [
  "1W",
  "1M",
  "3M",
  "1Y",
  "All",
];

type ChartDataType = {
  x: string;
  y: Record<"time", number>;
};

interface StatisticsContextValue {
  timeFrame: StatisticsTimeFrame;
  setTimeFrame: (timeFrame: StatisticsTimeFrame) => void;
  statisticsData: { date: string; time: number }[];
  chart: {
    chartRef: RefObject<View>;
    chartConfig: ReturnType<typeof useChart<ChartDataType>>["chartConfig"];
    tooltip: ReturnType<typeof useChart<ChartDataType>>["tooltip"];
  };
}

const StatisticsContext = createContext<StatisticsContextValue>({
  timeFrame: "1W",
  setTimeFrame: () => {},
  statisticsData: [],
  chart: {
    chartRef: { current: null },
    chartConfig: {} as ReturnType<
      typeof useChart<ChartDataType>
    >["chartConfig"],
    tooltip: {} as ReturnType<typeof useChart<ChartDataType>>["tooltip"],
  },
});

interface Props {
  children: React.ReactNode;
}

export default function StatisticsContextProvider({ children }: Props) {
  const [statistics, setStatistics] = useState({
    daily: getDailyStatistics(),
    weekly: getWeeklyStatistics(),
    monthly: getMonthlyStatistics(),
  });
  const [timeFrame, setTimeFrame] = useState<StatisticsTimeFrame>("1W");

  let numDotsVisible = 0;
  let statisticsData: { date: Date; time: number }[] = [];

  if (timeFrame === "1W") {
    statisticsData = statistics.daily;
    numDotsVisible = 7;
  } else if (timeFrame === "1M") {
    statisticsData = statistics.daily;
    numDotsVisible = 30;
  } else if (timeFrame === "3M") {
    statisticsData = statistics.weekly;
    numDotsVisible = 12;
  } else if (timeFrame === "1Y") {
    statisticsData = statistics.monthly;
    numDotsVisible = 12;
  } else if (timeFrame === "All") {
    statisticsData = statistics.monthly;
    numDotsVisible = statisticsData.length;
  }

  const formattedStatistics = statisticsData.map((stat) => ({
    date: stat.date.toISOString(),
    time: stat.time,
  }));

  const MAX_DOTS = 100;
  const recentStatistics =
    formattedStatistics.length > MAX_DOTS
      ? formattedStatistics.slice(formattedStatistics.length - MAX_DOTS)
      : formattedStatistics;

  const loadStatistics = useCallback(() => {
    setStatistics({
      daily: getDailyStatistics(),
      weekly: getWeeklyStatistics(),
      monthly: getMonthlyStatistics(),
    });
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("sessionsChanged", () =>
      loadStatistics(),
    );

    return () => {
      subscription.remove();
    };
  }, [loadStatistics]);

  const chartRef = useRef(null);

  const { chartConfig, tooltip, resetTranslate } = useChart<ChartDataType>({
    data: recentStatistics,
    chartRef,
    numDotsVisible,
    yKey: "time",
    initialState: {
      x: format(new Date(), "yyyy-MM-dd"),
      y: { time: 0 },
    },
    paddingX: 16,
  });

  useLayoutEffect(() => {
    resetTranslate();
  }, [resetTranslate, timeFrame]);

  return (
    <StatisticsContext.Provider
      value={{
        timeFrame,
        setTimeFrame,
        statisticsData: recentStatistics,
        chart: {
          chartRef,
          chartConfig,
          tooltip,
        },
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatisticsContext() {
  return useContext(StatisticsContext);
}
