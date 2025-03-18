import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import { CartesianChart, Bar } from "victory-native";
import useColors from "@/lib/hooks/useColors";

// Helper function to group sessions by hour
function groupSessionsByHour(sessions: ActivityType["sessions"]) {
  const hourData = Array(24).fill(0);

  sessions.forEach((session) => {
    const hour = session.startTime.getHours();
    hourData[hour] += session.duration / 60; // Convert to minutes
  });

  // Format for victory-native
  return hourData.map((value, index) => ({
    x: index,
    y: value,
  }));
}

interface WorkDistributionChartProps {
  sessions: ActivityType["sessions"];
}

export default function WorkDistributionChart({
  sessions,
}: WorkDistributionChartProps) {
  const { width } = useWindowDimensions();
  const colors = useColors();

  const chartData = groupSessionsByHour(sessions);
  const chartWidth = width - 40; // Account for padding

  // Format x-axis labels (hours)
  const formatHour = (hour: number) => {
    if (hour % 3 === 0) {
      return hour === 0 || hour === 12
        ? "12"
        : hour > 12
          ? `${hour - 12}`
          : `${hour}`;
    }
    return "";
  };

  const formatAMPM = (hour: number) => {
    if (hour % 6 === 0) {
      return hour < 12 ? "AM" : "PM";
    }
    return "";
  };

  return (
    <Card className="mx-4 mt-4 p-4">
      <Text className="mb-2 text-base font-medium text-foreground">
        Daily Work Distribution
      </Text>
      <View className="h-[180px]">
        <CartesianChart
          domain={{ y: [0, Math.max(...chartData.map((d) => d.y), 30)] }}
          xAxis={{
            tickValues: Array.from({ length: 24 }, (_, i) => i),
            tickFormat: formatHour,
            grid: { stroke: colors.muted },
          }}
          yAxis={{
            tickCount: 3,
            grid: { stroke: colors.muted },
          }}
          padding={{ left: 40, bottom: 30, right: 20, top: 10 }}
        >
          <Bar
            data={chartData}
            barWidth={chartWidth / 35}
            style={{
              data: { fill: colors.primary },
            }}
          />
        </CartesianChart>
      </View>
      <View className="mt-[-10px] flex-row justify-between">
        {[0, 6, 12, 18, 23].map((hour) => (
          <Text key={hour} className="text-xs text-muted-foreground">
            {hour === 0
              ? "12AM"
              : hour === 12
                ? "12PM"
                : hour > 12
                  ? `${hour - 12}${hour % 6 === 0 ? "PM" : ""}`
                  : `${hour}${hour % 6 === 0 ? "AM" : ""}`}
          </Text>
        ))}
      </View>
    </Card>
  );
}
