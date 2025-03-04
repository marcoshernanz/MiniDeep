import React from "react";
import { View, Text } from "react-native";

// Define the colors for the chart bars
const CHART_COLORS = [
  "bg-primary",
  "bg-blue-500", // Replaced bg-chart-1 with a standard color
  "bg-green-500", // Replaced bg-chart-2 with a standard color
  "bg-yellow-500", // Replaced bg-chart-3 with a standard color
  "bg-red-500", // Replaced bg-chart-4 with a standard color
  "bg-purple-500", // Replaced bg-chart-5 with a standard color
  "bg-secondary",
];

type DailyStatsProps = {
  dailyStats: {
    date: string; // format: YYYY-MM-DD
    totalTime: number; // in seconds
  }[];
};

export default function DailyWorkChart({ dailyStats }: DailyStatsProps) {
  // Get the most recent 7 days of data
  const recentStats = [...dailyStats]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)
    .reverse();

  // Find max value for scaling
  const maxTime = Math.max(...recentStats.map((day) => day.totalTime), 3600); // minimum of 1 hour for scale

  return (
    <View>
      <View className="h-40 flex-row items-end justify-around">
        {recentStats.map((day, index) => {
          // Calculate height percentage based on max time
          const heightPercentage = (day.totalTime / maxTime) * 100;

          // Format date for display (e.g., Mon, Tue, etc)
          const dayDate = new Date(day.date);
          const dayName = dayDate.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <View key={day.date} className="items-center">
              <View
                style={{ height: `${heightPercentage}%` }}
                className={`w-8 rounded-t-sm ${CHART_COLORS[index % CHART_COLORS.length]}`}
              />
              <Text className="mt-2 text-xs text-muted-foreground">
                {dayName}
              </Text>
            </View>
          );
        })}

        {/* If we have less than 7 days of data, fill with empty bars */}
        {Array.from({ length: Math.max(0, 7 - recentStats.length) }).map(
          (_, i) => (
            <View key={`empty-${i}`} className="items-center">
              <View className="h-0 w-8" />
              <Text className="mt-2 text-xs text-muted-foreground">-</Text>
            </View>
          ),
        )}
      </View>

      <View className="mt-2 self-end">
        <Text className="text-xs text-muted-foreground">
          {formatTime(maxTime)} max
        </Text>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins > 0 ? `${mins}m` : ""}`;
  }
  return `${mins}m`;
}
