import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useWorkStats } from "@/lib/hooks/useWorkStats";

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function StatsOverview() {
  const { stats, loading } = useWorkStats();

  if (loading) {
    return (
      <View className="py-4">
        <Text className="text-center text-sm text-muted-foreground">
          Loading stats...
        </Text>
      </View>
    );
  }

  return (
    <Card className="p-4">
      <Text className="mb-2 text-lg font-medium">Work Stats</Text>

      <View className="mb-4 flex-row justify-between">
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Total Time</Text>
          <Text className="text-lg font-medium">
            {formatTime(stats.totalWorkTime)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Sessions</Text>
          <Text className="text-lg font-medium">{stats.totalSessions}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Completed</Text>
          <Text className="text-lg font-medium">{stats.completedSessions}</Text>
        </View>
      </View>

      {stats.lastSessionDate && (
        <Text className="text-sm text-muted-foreground">
          Last session: {stats.lastSessionDate.toLocaleDateString()}
        </Text>
      )}
    </Card>
  );
}
