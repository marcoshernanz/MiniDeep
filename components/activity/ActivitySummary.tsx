import { View } from "react-native";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import formatTime from "@/lib/utils/formatTime";

interface ActivitySummaryProps {
  totalTime: number;
  totalSessions: number;
}

export default function ActivitySummary({
  totalTime,
  totalSessions,
}: ActivitySummaryProps) {
  return (
    <View className="flex-row gap-4 px-4">
      <Card className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground">Total Time</Text>
        <Text className="text-2xl font-semibold text-foreground">
          {formatTime(totalTime)}
        </Text>
      </Card>

      <Card className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground">Total Sessions</Text>
        <Text className="text-2xl font-semibold text-foreground">
          {totalSessions}
        </Text>
      </Card>
    </View>
  );
}
