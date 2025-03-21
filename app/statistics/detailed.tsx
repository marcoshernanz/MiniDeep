import React, { useState, useMemo } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useWorkStats } from "@/lib/hooks/useWorkStats";
import { ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react-native";
import { CartesianChart, useChartPressState } from "victory-native";
import { Circle } from "@shopify/react-native-skia";
import { useFont } from "@shopify/react-native-skia";
import useColors from "@/lib/hooks/useColors";

type TimeRangeOption = "7d" | "1m" | "3m" | "1y" | "5y" | "all";

// Define our chart data type for TypeScript
type ChartDataPoint = {
  timestamp: number; // Use as x-axis value
  duration: number; // Duration in minutes
  completed: number; // 0 or 1 (for boolean)
};

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function DetailedStatisticsScreen() {
  const { stats, sessions, loading, refresh } = useWorkStats();
  const { getColor } = useColors();
  const router = useRouter();

  // Use a system font as a fallback until we can load a proper font
  const font = useFont(undefined, 12);
  const [selectedRange, setSelectedRange] = useState<TimeRangeOption>("7d");
  const { state: tooltipState, isActive: isTooltipActive } = useChartPressState(
    {
      x: 0,
      y: { duration: 0 },
    },
  );

  // Format sessions data for the chart
  const chartData = useMemo(() => {
    if (!sessions.length) return [];

    // Get date ranges based on selected option
    const today = new Date();
    let startDate = new Date();

    switch (selectedRange) {
      case "7d":
        startDate.setDate(today.getDate() - 7);
        break;
      case "1m":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "1y":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "5y":
        startDate.setFullYear(today.getFullYear() - 5);
        break;
      case "all":
        // No filtering for "all"
        startDate = new Date(0);
        break;
    }

    // Filter and format sessions
    return sessions
      .filter((session) => session.startDate >= startDate)
      .map((session) => {
        // Calculate session duration in minutes
        const durationMinutes = session.events.reduce((total, event) => {
          if (event.action === "complete" || event.action === "stop") {
            return total + event.duration / 60; // Convert seconds to minutes
          }
          return total;
        }, 0);

        return {
          date: session.startDate,
          duration: durationMinutes, // Duration in minutes
          completed: session.completed ? 1 : 0,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sessions, selectedRange]);

  // Calculate total time and average session time
  const totalTime = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, data) => sum + data.duration, 0) * 60; // Convert back to seconds
  }, [chartData]);

  const avgSessionTime = useMemo(() => {
    if (!chartData.length) return 0;
    return totalTime / chartData.length;
  }, [totalTime, chartData]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="hsl(var(--primary))" />
          <Text className="mt-4 text-foreground">
            Loading your statistics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const TimeRangeButton = ({
    range,
    label,
  }: {
    range: TimeRangeOption;
    label: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedRange(range)}
      className={`rounded-md px-3 py-2 ${
        selectedRange === range ? "bg-primary" : "bg-secondary"
      }`}
    >
      <Text
        className={`text-sm ${
          selectedRange === range
            ? "font-medium text-primary-foreground"
            : "text-secondary-foreground"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-secondary"
            >
              <ChevronLeft size={20} className="text-primary" />
            </TouchableOpacity>
            <View>
              <Text className="text-3xl font-bold text-foreground">
                Detailed Statistics
              </Text>
              <Text className="text-muted-foreground">
                {chartData.length} sessions • {formatTime(totalTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Time Range Selector */}
        <View className="mb-4 px-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-1"
          >
            <TimeRangeButton range="7d" label="7 Days" />
            <TimeRangeButton range="1m" label="1 Month" />
            <TimeRangeButton range="3m" label="3 Months" />
            <TimeRangeButton range="1y" label="1 Year" />
            <TimeRangeButton range="5y" label="5 Years" />
            <TimeRangeButton range="all" label="All Time" />
          </ScrollView>
        </View>

        {/* Summary Cards */}
        <View className="flex-row gap-4 px-4">
          <Card className="flex-1 p-4">
            <Text className="text-sm text-muted-foreground">Total Time</Text>
            <Text className="text-2xl font-semibold text-foreground">
              {formatTime(totalTime)}
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <Text className="text-sm text-muted-foreground">Avg Session</Text>
            <Text className="text-2xl font-semibold text-foreground">
              {formatTime(avgSessionTime)}
            </Text>
          </Card>
        </View>

        {/* Scatter Chart */}
        <View className="mt-6 px-4">
          <Card className="p-4">
            <Text className="mb-4 text-xl font-semibold text-foreground">
              Work Sessions Chart
            </Text>
            {chartData.length > 0 ? (
              <View className="h-72 w-full">
                <CartesianChart
                  data={chartData}
                  xKey="date"
                  yKeys={["duration"]}
                  chartPressState={tooltipState}
                  padding={{ left: 40, bottom: 40, right: 20, top: 20 }}
                  xAxis={{
                    font,
                    tickCount: 5,
                    lineColor: getColor("border"),
                    labelColor: getColor("mutedForeground"),
                    formatXLabel: (timestamp) => {
                      const d = new Date(timestamp);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    },
                  }}
                  yAxis={[
                    {
                      font,
                      tickCount: 5,
                      lineColor: getColor("border"),
                      labelColor: getColor("mutedForeground"),
                      formatYLabel: (minutes) => `${Math.round(minutes / 60)}h`,
                    },
                  ]}
                >
                  {({ points }) => (
                    <>
                      {points.duration.map((point, i) => {
                        const isCompleted = chartData[i].completed === 1;
                        return (
                          <Circle
                            key={`point-${i}`}
                            cx={point.x}
                            cy={point.y}
                            r={isCompleted ? 6 : 4}
                            color={
                              isCompleted
                                ? getColor("primary")
                                : getColor("secondary")
                            }
                          />
                        );
                      })}
                    </>
                  )}
                </CartesianChart>

                {/* Tooltip */}
                {isTooltipActive && (
                  <View
                    className="absolute rounded-md border border-border bg-card px-2 py-1"
                    style={{
                      left: tooltipState.x.position.value - 50,
                      top: tooltipState.y.duration.position.value - 50,
                    }}
                  >
                    <Text className="text-sm text-foreground">
                      {formatTime(tooltipState.y.duration.value.value * 60)}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="h-72 items-center justify-center">
                <Text className="text-center text-muted-foreground">
                  No sessions available for the selected time range
                </Text>
              </View>
            )}
            <View className="mt-2 flex-row justify-between">
              <View className="flex-row items-center">
                <View className="mr-2 h-3 w-3 rounded-full bg-primary" />
                <Text className="text-xs text-muted-foreground">Completed</Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-2 h-3 w-3 rounded-full bg-secondary" />
                <Text className="text-xs text-muted-foreground">Stopped</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Refresh Button at the bottom */}
        <View className="mb-8 mt-6 px-4">
          <Button variant="outline" onPress={refresh}>
            <Text>Refresh Data</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
