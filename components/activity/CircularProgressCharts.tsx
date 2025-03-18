import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import useColors from "@/lib/hooks/useColors";
import { VictoryPie } from "victory-native";
import formatTime from "@/lib/utils/formatTime";

interface CircularProgressChartsProps {
  activity: ActivityType;
}

export default function CircularProgressCharts({
  activity,
}: CircularProgressChartsProps) {
  const colors = useColors();

  // Calculate completion rate
  const completedSessions = activity.sessions.filter((s) => s.completed).length;
  const incompleteSessions = activity.sessions.length - completedSessions;
  const completionRate =
    activity.sessions.length > 0
      ? Math.round((completedSessions / activity.sessions.length) * 100)
      : 0;

  // Calculate total work hours (convert seconds to hours)
  const totalWorkHours = activity.totalWorkTime / 3600;
  const maxHoursInDay = 8; // Reference value for comparison
  const restHours = Math.max(0, maxHoursInDay - totalWorkHours);

  return (
    <View className="mx-4 mt-4 flex-row gap-4">
      <Card className="flex-1 p-4">
        <Text className="text-center text-sm text-muted-foreground">
          Completed Sessions
        </Text>
        <View className="items-center justify-center">
          <VictoryPie
            data={[
              { x: "Completed", y: completedSessions || 0.001 },
              { x: "Incomplete", y: incompleteSessions || 0.001 },
            ]}
            width={120}
            height={120}
            innerRadius={35}
            labelRadius={({ innerRadius }) => Number(innerRadius) + 30}
            padding={0}
            colorScale={[colors.success, colors.muted]}
            labels={() => null}
          />
          <View className="absolute items-center justify-center">
            <Text className="text-3xl font-bold text-foreground">
              {completionRate}%
            </Text>
          </View>
        </View>
      </Card>

      <Card className="flex-1 p-4">
        <Text className="text-center text-sm text-muted-foreground">
          Work Hours
        </Text>
        <View className="items-center justify-center">
          <VictoryPie
            data={[
              { x: "Work", y: totalWorkHours || 0.001 },
              { x: "Rest", y: restHours || 0.001 },
            ]}
            width={120}
            height={120}
            innerRadius={35}
            labelRadius={({ innerRadius }) => Number(innerRadius) + 30}
            padding={0}
            colorScale={[colors.primary, colors.muted]}
            labels={() => null}
          />
          <View className="absolute items-center justify-center">
            <Text className="text-base font-bold text-foreground">
              {formatTime(activity.totalWorkTime)}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
