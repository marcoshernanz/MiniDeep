import { View } from "react-native";
import { Text } from "../ui/text";

export default function StatisticsHeader() {
  return (
    <View className="mb-4 px-4">
      <Text className="text-3xl font-bold text-foreground">Statistics</Text>
    </View>
  );
}
