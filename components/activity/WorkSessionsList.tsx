import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import useColors from "@/lib/hooks/useColors";
import formatTime from "@/lib/utils/formatTime";
import { format } from "date-fns";

interface WorkSessionsListProps {
  sessions: ActivityType["sessions"];
}

export default function WorkSessionsList({ sessions }: WorkSessionsListProps) {
  const colors = useColors();

  if (sessions.length === 0) {
    return (
      <Card className="mx-4 mt-4 p-4">
        <Text className="text-center text-muted-foreground">
          No work sessions for this day
        </Text>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6 mt-4 p-4">
      <Text className="mb-2 font-medium text-foreground">Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item, index) =>
          `session-${item.startDate.getTime()}-${index}`
        }
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="border-b border-border py-3">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-foreground">
                {format(item.startDate.getTime(), "h:mm a")}
              </Text>
              <View className="flex-row items-center">
                <Text className="mr-2 text-foreground">
                  {formatTime(item.duration)}
                </Text>
                <View
                  className={`size-3 rounded-full ${item.completed ? "bg-success" : "bg-muted"}`}
                />
              </View>
            </View>
          </View>
        )}
      />
    </Card>
  );
}
