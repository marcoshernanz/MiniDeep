import { View, Animated, PanResponder, Dimensions } from "react-native";
import { Text } from "../ui/text";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Audio } from "expo-av";
import playSound from "@/lib/utils/sound/playSound";
import { ArrowUpCircle, CheckCircle } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import stopSound from "@/lib/utils/sound/stopSound";
import * as Haptics from "expo-haptics";

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
  const swipeIndicatorHeight = useRef(new Animated.Value(0)).current;
  const swipeProgress = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const dismissThreshold = -150;
  const screenHeight = Dimensions.get("window").height;

  // Derived animated values
  const swipeIndicatorOpacity = swipeProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  const checkIconOpacity = swipeProgress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const arrowTranslateY = swipeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

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

    // Trigger celebration animation after a short delay
    const animationTimer = setTimeout(() => {
      Animated.spring(celebrationScale, {
        toValue: 1,
        tension: 50,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }, 300);

    // Cleanup
    return () => {
      isMounted = false;
      stopSound(sound);
      clearTimeout(animationTimer);
    };
  }, []);

  // Set up pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy < 0) {
        // Only allow upward swipe
        const cappedDy = Math.max(gestureState.dy, dismissThreshold * 1.5);
        pan.setValue({ x: 0, y: cappedDy });

        // Calculate progress based on swipe distance
        const progress = Math.min(
          Math.abs(cappedDy) / Math.abs(dismissThreshold),
          1,
        );
        swipeProgress.setValue(progress);

        // Update the swipe indicator height
        swipeIndicatorHeight.setValue(Math.abs(cappedDy) * 0.5);

        // Calculate opacity based on swipe distance
        const newOpacity = 1 - progress * 0.3; // Subtle fade while swiping
        opacity.setValue(newOpacity);

        // Provide haptic feedback at threshold
        if (progress >= 0.95 && progress <= 1.05) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < dismissThreshold) {
        // If swiped up more than threshold, dismiss with animated sequence
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pan.y, {
            toValue: -screenHeight,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(swipeProgress, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(async () => {
          await stopSound(sound);
          onDismiss();
        });
      } else {
        // Reset position with spring animation for a bouncy effect
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          tension: 40,
          friction: 5,
          useNativeDriver: true,
        }).start();

        // Reset other animations
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(swipeProgress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(swipeIndicatorHeight, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleStopSound = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pan.y, {
        toValue: -screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await stopSound(sound);
      onDismiss();
    });
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

      {/* Swipe indicator track */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "rgba(255,255,255,0.2)",
          opacity: swipeIndicatorOpacity,
          zIndex: 10,
        }}
      >
        {/* Swipe indicator progress */}
        <Animated.View
          style={{
            height: "100%",
            backgroundColor: "#22c55e",
            width: swipeProgress.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </Animated.View>

      <View
        className="flex-1 items-center justify-center px-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <Animated.View
          className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-lg"
          style={{
            transform: [
              {
                scale: celebrationScale.interpolate({
                  inputRange: [0, 0.5, 0.8, 1],
                  outputRange: [0.8, 1.05, 0.95, 1],
                }),
              },
            ],
          }}
        >
          <Text className="mb-4 text-center text-3xl font-bold">
            Time's up!
          </Text>
          <Text className="mb-8 text-center text-lg">
            Your deep work session is complete.
          </Text>

          <View className="mb-8 items-center">
            <Animated.View
              style={{
                alignItems: "center",
                transform: [{ translateY: arrowTranslateY }],
              }}
            >
              <Animated.View
                style={{
                  opacity: swipeProgress.interpolate({
                    inputRange: [0, 0.7],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                }}
              >
                <ArrowUpCircle size={48} className="text-primary" />
              </Animated.View>

              <Animated.View
                style={{
                  position: "absolute",
                  opacity: checkIconOpacity,
                }}
              >
                <CheckCircle size={48} className="text-green-500" />
              </Animated.View>

              <Text className="mt-2 text-center text-muted-foreground">
                Swipe up to dismiss
              </Text>
            </Animated.View>
          </View>

          <Button
            onPress={handleStopSound}
            variant="default"
            className="w-full"
          >
            <Text className="font-bold text-white"> Done</Text>
          </Button>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
