import cn from "@/lib/utils/cn";
import { memo } from "react";
import { Pressable } from "react-native";
import { Text } from "../ui/text";
import { format } from "date-fns";
import { View } from "react-native";
import formatTime from "@/lib/utils/formatTime";
import { ActivityType } from "@/context/ActivityContext";

interface WorkSessionItemProps {
  item: ActivityType["sessions"][number];
  index: number;
}

const WorkSessionItem = memo<WorkSessionItemProps>(
  ({ item, index }) => (
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
          {formatTime(item.duration / 1000)}
        </Text>
        <View
          className={`size-3 rounded-full ${item.completed ? "bg-green/80" : "bg-red/80"}`}
        />
      </View>
    </Pressable>
  ),
  (prev, next) =>
    prev.item.startDate.getTime() === next.item.startDate.getTime() &&
    prev.item.duration === next.item.duration &&
    prev.item.completed === next.item.completed &&
    prev.index === next.index,
);

export default WorkSessionItem;
