import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { width } = Dimensions.get("window");

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
