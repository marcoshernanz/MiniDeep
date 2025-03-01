import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColors from "@/lib/hooks/useColors";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DeepWorkScreen() {
  const colors = useColors();
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Load sound
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/timer-done.mp3"),
      );
      setSound(sound);
    };

    loadSound();
    return () => {
      sound?.unloadAsync();
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished
            playSound();
            setIsActive(false);
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Play sound when timer finishes
  const playSound = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  };

  // Control functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const adjustDuration = (amount: number) => {
    if (!isActive) {
      const newDuration = Math.max(5, duration + amount);
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Deep Work Timer
      </Text>

      <Card style={[styles.timerCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.timerText, { color: colors.foreground }]}>
          {formatTime(timeLeft)}
        </Text>

        <View style={styles.durationControls}>
          <Button
            variant="outline"
            size="icon"
            onPress={() => adjustDuration(-5)}
            disabled={isActive || duration <= 5}
          >
            <Minus
              size={24}
              color={isActive ? colors.muted : colors.foreground}
            />
          </Button>

          <Text style={[styles.durationText, { color: colors.foreground }]}>
            {duration} min
          </Text>

          <Button
            variant="outline"
            size="icon"
            onPress={() => adjustDuration(5)}
            disabled={isActive}
          >
            <Plus
              size={24}
              color={isActive ? colors.muted : colors.foreground}
            />
          </Button>
        </View>
      </Card>

      <View style={styles.controls}>
        <Button
          variant="default"
          size="lg"
          onPress={toggleTimer}
          style={styles.controlButton}
        >
          {isActive ? (
            <Pause size={24} color={colors.background} />
          ) : (
            <Play size={24} color={colors.background} />
          )}
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {isActive ? "Pause" : "Start"}
          </Text>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onPress={resetTimer}
          style={styles.controlButton}
          disabled={timeLeft === duration * 60 && !isActive}
        >
          <RotateCcw size={24} color={colors.foreground} />
          <Text style={[styles.buttonText, { color: colors.foreground }]}>
            Reset
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  timerCard: {
    width: "90%",
    padding: 20,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 30,
  },
  timerText: {
    fontSize: 60,
    fontWeight: "bold",
    letterSpacing: 2,
    marginVertical: 20,
  },
  durationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  durationText: {
    fontSize: 18,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 30,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
  },
});
