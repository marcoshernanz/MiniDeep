import { View } from "react-native";
import { Text } from "../ui/text";

export default function TimerCompletedScreen() {
  return (
    <View className="mt-4">
      <Text className="text-center text-xl font-bold">Time's up!</Text>
    </View>
  );
}
