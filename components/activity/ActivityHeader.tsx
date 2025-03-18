import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { format, isToday, isYesterday } from "date-fns";

interface Props {
  selectedDate: Date;
}

export default function ActivityHeader({ selectedDate }: Props) {
  const formatDateTitle = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMMM d");
    }
  };

  return (
    <View className="px-4">
      <Text className="text-2xl font-bold text-foreground">Activity</Text>
      <Text className="mt-1 text-xl text-primary">
        {formatDateTitle(selectedDate)}
      </Text>
    </View>
  );
}
