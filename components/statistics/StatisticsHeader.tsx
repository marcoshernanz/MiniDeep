import { View } from "react-native";
import { Text } from "../ui/text";

export default function StatisticsHeader() {
  return (
    <View className="px-4">
      <Text className="text-3xl font-bold text-foreground">Activity</Text>
    </View>
  );
}
