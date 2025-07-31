import { View } from "react-native";
import { Text } from "../../ui/Text";
import { Button } from "../../ui/button";
import * as Notifications from "expo-notifications";
import { useTimerContext } from "@/context/OLDTimerContext";

export default function TimerCompletedScreen() {
  const {
    timer: { stopTimer },
  } = useTimerContext();

  const handleDone = async () => {
    await Notifications.dismissAllNotificationsAsync();

    stopTimer();
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 justify-center">
        <View className="gap-10">
          <Text className="text-5xl font-semibold">Time's up!</Text>
          <Button onPress={handleDone} className="w-full" size="lg">
            <Text className="font-bold">Done</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
