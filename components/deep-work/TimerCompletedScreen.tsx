import { View, Animated, PanResponder } from "react-native";
import { Text } from "../ui/text";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Audio } from "expo-av";
import playSound from "@/lib/utils/sound/playSound";
import { ArrowUpCircle } from "lucide-react-native";
import { BlurView } from "expo-blur";
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
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Set up sound effect
  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
        // Play sound with loop
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

    // Cleanup
    return () => {
      isMounted = false;
      stopSound(sound);
    };
  }, []);

  // Set up pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy < 0) {
        // Only allow upward swipe
        pan.setValue({ x: 0, y: Math.max(gestureState.dy, -200) });

        // Calculate opacity based on swipe distance
        const newOpacity = 1 - Math.min(Math.abs(gestureState.dy) / 200, 1);
        opacity.setValue(newOpacity);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -100) {
        // If swiped up more than threshold, dismiss
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(async () => {
          await stopSound(sound);
          onDismiss();
        });
      } else {
        // Reset position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();

        // Reset opacity
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleStopSound = async () => {
    await stopSound(sound);
    onDismiss();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        width: "100%",
        transform: [{ translateY: pan.y }],
        opacity,
      }}
      {...panResponder.panHandlers}
    >
      <BlurView intensity={85} className="absolute inset-0" />

      <View
        className="flex-1 items-center justify-center px-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-lg">
          <Text className="mb-4 text-center text-3xl font-bold">
            Time's up!
          </Text>
          <Text className="mb-8 text-center text-lg">
            Your deep work session is complete.
          </Text>

          <View className="mb-8 items-center">
            <ArrowUpCircle size={48} className="text-primary" />
            <Text className="mt-2 text-center text-muted-foreground">
              Swipe up to dismiss
            </Text>
          </View>

          <Button
            onPress={handleStopSound}
            variant="default"
            className="w-full"
          >
            Done
          </Button>
        </View>
      </View>
    </Animated.View>
  );
}
