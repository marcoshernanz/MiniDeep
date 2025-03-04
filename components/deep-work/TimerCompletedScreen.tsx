import { View, Animated } from "react-native";
import { Text } from "../ui/text";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Audio } from "expo-av";
import playSound from "@/lib/utils/sound/playSound";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import stopSound from "@/lib/utils/sound/stopSound";

interface TimerCompletedScreenProps {
  onDismiss: () => void;
}

export default function TimerCompletedScreen({
  onDismiss,
}: TimerCompletedScreenProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
        const soundInstance = await playSound(
          require("@/assets/audio/timer-done.mp3"),
          { loop: true },
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

  return (
    <View className="flex-1 justify-center">
      <View className="gap-10">
        <Text className="text-5xl font-semibold">Time's up!</Text>
        <Button onPress={() => {}} className="w-full" size="lg">
          <Text className="font-bold">Done</Text>
        </Button>
      </View>
    </View>
  );
}
