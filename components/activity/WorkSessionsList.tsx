import React from "react";
import { View, FlatList, Pressable } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import formatTime from "@/lib/utils/formatTime";
import { format } from "date-fns";
import cn from "@/lib/utils/cn";

interface WorkSessionsListProps {
  sessions: ActivityType["sessions"];
}

export default function WorkSessionsList({ sessions }: WorkSessionsListProps) {
  return (
    <Card className="mx-4 p-4">
      <Text className="mb-4 text-xl font-semibold text-foreground">
        Sessions
      </Text>
      {sessions.length === 0 && (
        <Text className="text-center text-muted-foreground">
          No work sessions for this day
        </Text>
      )}
      <FlatList
        data={sessions}
        keyExtractor={(item, index) =>
          `session-${item.startDate.getTime()}-${index}`
        }
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <Pressable
            className={cn(
              "flex-row items-center justify-between",
              index !== 0 && "mt-2 border-t border-t-muted pt-2",
            )}
          >
            <Text className="font-medium text-foreground">
              {format(item.startDate, "HH:mm")}
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-2 text-foreground">
                {formatTime(item.duration)}
              </Text>
              <View
                className={`size-3 rounded-full ${item.completed ? "bg-green/80" : "bg-red/80"}`}
              />
            </View>
          </Pressable>
        )}
      />
    </Card>
  );
}
