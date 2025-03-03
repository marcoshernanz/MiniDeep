import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { WorkSession } from "@/lib/utils/timeTracking";

type WorkSessionsListProps = {
  sessions: WorkSession[];
};

export default function WorkSessionsList({ sessions }: WorkSessionsListProps) {
  // Limit to 5 most recent sessions and sort by date (newest first)
  const recentSessions = [...sessions]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 5);

  if (recentSessions.length === 0) {
    return (
      <View className="py-4">
        <Text className="text-center text-sm text-muted-foreground">
          No sessions recorded yet
        </Text>
      </View>
    );
  }

  const calculateSessionDuration = (session: WorkSession): number => {
    if (session.events.length <= 1) return 0;

    let workTime = 0;
    let lastStartTime: number | null = null;

    for (const event of session.events) {
      if (event.action === "start" || event.action === "resume") {
        lastStartTime = event.timestamp;
      } else if (
        (event.action === "pause" ||
          event.action === "stop" ||
          event.action === "complete") &&
        lastStartTime
      ) {
        workTime += (event.timestamp - lastStartTime) / 1000;
        lastStartTime = null;
      }
    }

    return workTime;
  };

  const renderSessionItem = ({ item }: { item: WorkSession }) => {
    const sessionDate = new Date(item.startTime);
    const formattedDate = sessionDate.toLocaleDateString();
    const formattedTime = sessionDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const duration = calculateSessionDuration(item);
    const durationFormatted = formatTime(duration);

    let statusBadge = "";
    let statusColor = "";

    if (item.completed) {
      statusBadge = "Completed";
      statusColor = "bg-green-500";
    } else if (item.endTime) {
      statusBadge = "Stopped";
      statusColor = "bg-yellow-500";
    } else {
      statusBadge = "In progress";
      statusColor = "bg-blue-500";
    }

    const plannedDuration = formatTime(item.duration);

    return (
      <View className="border-b border-border py-3">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="font-medium text-foreground">
              {formattedDate} at {formattedTime}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Planned: {plannedDuration} • Worked: {durationFormatted}
            </Text>
          </View>

          <View
            className={`w-20 items-center justify-center rounded-full px-2 py-1 ${statusColor}`}
          >
            <Text className="text-xs text-white">{statusBadge}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={recentSessions}
      renderItem={renderSessionItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}
