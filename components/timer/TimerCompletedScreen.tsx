import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import * as Notifications from "expo-notifications";
import stopSound from "@/lib/utils/sound/stopSound";
import { Audio } from "expo-av";
import { useEffect, useRef } from "react";
import { useTimerContext } from "@/context/TimerContext";

export default function TimerCompletedScreen() {
  const {
    timer: { stopTimer },
  } = useTimerContext();

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const sound = soundRef.current;

    return () => {
      if (sound) {
        stopSound(sound);
      }
    };
  }, []);

  const handleDone = async () => {
    await Notifications.dismissAllNotificationsAsync();

    if (soundRef.current) {
      await stopSound(soundRef.current);
    }

    stopTimer();
  };

  return (
    <View className="flex-1 justify-center">
      <View className="gap-10">
        <Text className="text-5xl font-semibold">Time's up!</Text>
        <Button onPress={handleDone} className="w-full" size="lg">
          <Text className="font-bold">Done</Text>
        </Button>
      </View>
    </View>
  );
}
