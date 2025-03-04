import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type CompletionRateChartProps = {
  completionRate: number;
  completedSessions: number;
  totalSessions: number;
};

export default function CompletionRateChart({
  completionRate,
  completedSessions,
  totalSessions,
}: CompletionRateChartProps) {
  // Determine color based on completion rate
  let ringColor = "border-muted-foreground";

  if (totalSessions > 0) {
    if (completionRate >= 80) {
      ringColor = "border-green-500";
    } else if (completionRate >= 60) {
      ringColor = "border-primary";
    } else if (completionRate >= 40) {
      ringColor = "border-yellow-500";
    } else {
      ringColor = "border-red-500";
    }
  }

  return (
    <View
      className={`h-24 w-24 items-center justify-center rounded-full border-4 ${ringColor}`}
    >
      <Text className="text-2xl font-bold text-foreground">
        {completionRate}%
      </Text>
      <Text className="text-xs text-muted-foreground">Completion</Text>
    </View>
  );
}
