import React from "react";
import { FlatList } from "react-native";
import { Text } from "../ui/text";
import { Card } from "../ui/card";
import WorkSessionItem from "./WorkSessionItem";
import { ActivityType } from "@/context/ActivityContext";

interface Props {
  sessions: ActivityType["sessions"];
}

export default function WorkSessionsList({ sessions }: Props) {
  return (
    <Card className="mx-4 p-4">
      <Text className="mb-4 text-xl font-semibold text-foreground">
        Sessions
      </Text>
      {sessions.length === 0 && (
        <Text className="mb-4 text-center text-muted-foreground">
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
          <WorkSessionItem item={item} index={index} />
        )}
      />
    </Card>
  );
}
