import { View } from "react-native";
import { Text } from "../ui/text";
import { format } from "date-fns";

interface Props {
  selectedDate: Date;
}

export default function ActivityHeader({ selectedDate }: Props) {
  return (
    <View className="px-4">
      <Text className="text-3xl font-bold text-foreground">Activity</Text>
      <Text className="mt-2 text-muted-foreground">
        {format(selectedDate, "EEEE, MMMM d, yyyy")}
      </Text>
    </View>
  );
}
