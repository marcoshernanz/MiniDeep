import { View } from "react-native";
import { Text } from "../ui/text";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Audio } from "expo-av";
import playSound from "@/lib/utils/sound/playSound";
import stopSound from "@/lib/utils/sound/stopSound";

interface TimerCompletedScreenProps {
  onDismiss: () => void;
}

export default function TimerCompletedScreen({
  onDismiss,
}: TimerCompletedScreenProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
        const soundInstance = await playSound(
          require("@/assets/audio/timer_done.wav"),
          { loop: true, asAlarm: true },
        );

        if (isMounted) {
          setSound(soundInstance);
        } else if (soundInstance) {
          await stopSound(soundInstance);
        }
      } catch (error) {
        console.error("Failed to load and play sound", error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      stopSound(sound);
    };
  }, []);

  const handleFinish = async () => {
    await stopSound(sound);
    onDismiss();
  };

  return (
    <View className="flex-1 justify-center">
      <View className="gap-10">
        <Text className="text-5xl font-semibold">Time's up!</Text>
        <Button onPress={handleFinish} className="w-full" size="lg">
          <Text className="font-bold">Done</Text>
        </Button>
      </View>
    </View>
  );
}
