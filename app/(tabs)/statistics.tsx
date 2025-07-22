import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import useDailyWorkDistribution from "@/lib/hooks/statistics/useDailyWorkDistribution";
import useMonthlyWorkDistribution from "@/lib/hooks/statistics/useMonthlyWorkDistribution";
import useWeeklyWorkDistribution from "@/lib/hooks/statistics/useWeeklyWorkDistribution";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { width } = Dimensions.get("window");

  const dailyData = useDailyWorkDistribution();
  const weeklyData = useWeeklyWorkDistribution();
  const monthlyData = useMonthlyWorkDistribution();

  const dataMap = useMemo<Record<string, number>>(() => {
    if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
      return dailyData;
    } else if (selectedTimeFrame === "3M") {
      return weeklyData;
    } else {
      return monthlyData;
    }
  }, [dailyData, monthlyData, selectedTimeFrame, weeklyData]);

  const chartData = useMemo(() => {
    return Object.entries(dataMap)
      .sort(([a], [b]) => parseISO(a).getTime() - parseISO(b).getTime())
      .reduce<Record<string, number | null>>((acc, [key, val]) => {
        const date = parseISO(key);
        const labelFormat =
          selectedTimeFrame === "7D" ||
          selectedTimeFrame === "1M" ||
          selectedTimeFrame === "3M"
            ? "MMM dd"
            : "MMM yyyy";
        acc[format(date, labelFormat)] = val;
        return acc;
      }, {});
  }, [dataMap, selectedTimeFrame]);

  const numPointsVisible = useMemo(() => {
    const len = Object.keys(chartData).length;
    if (selectedTimeFrame === "7D") return 7;
    if (selectedTimeFrame === "1M") return 30;
    if (selectedTimeFrame === "3M") return 12;
    if (selectedTimeFrame === "1Y") return 12;
    else return len === 1 ? 2 : len;
  }, [chartData, selectedTimeFrame]);

  const pointsPerLabel = useMemo(() => {
    const len = Object.keys(chartData).length;
    if (selectedTimeFrame === "7D") return 2;
    if (selectedTimeFrame === "1M") return 7;
    if (selectedTimeFrame === "3M") return 3;
    if (selectedTimeFrame === "1Y") return 3;
    else return 3 * Math.round(1 + len / 365);
  }, [chartData, selectedTimeFrame]);

  return (
    <SafeArea style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Statistics</Title>
        <StatisticsTimeFrameSelector
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
      </View>

      <View
        style={{ flex: 1 }}
        onLayout={(e) => setChartHeight(e.nativeEvent.layout.height)}
      >
        <Chart
          data={chartData}
          width={width}
          height={chartHeight}
          pointsPerLabel={pointsPerLabel}
          numPointsVisible={numPointsVisible}
          tooltipWidth={110}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    justifyContent: "space-between",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    paddingBottom: 12,
  },
});
