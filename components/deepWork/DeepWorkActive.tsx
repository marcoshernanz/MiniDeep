import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import Button from "../ui/Button";
import TimeCounter from "./TimeCounter";
import useTimer from "@/lib/hooks/useTimer";
import useStopwatch from "@/lib/hooks/useStopwatch";
import extractTime from "@/lib/utils/extractTime";

interface Props {
  type: WorkSession["type"];
}

export default function DeepWorkActive({ type }: Props) {
  const timer = useTimer();
  const stopwatch = useStopwatch();

  const isTimer = type === "timer";

  const status = isTimer ? timer.status : stopwatch.status;
  const time = isTimer ? timer.timeLeft : stopwatch.timeElapsed;
  const togglePause = isTimer ? timer.togglePause : stopwatch.togglePause;
  const stop = isTimer ? timer.stop : stopwatch.stop;

  const { hours, minutes, seconds } = extractTime(time);

  if (status === "finished") return null;

  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>{isTimer ? "Timer" : "Stopwatch"}</Title>
      <View style={styles.container}>
        <TimeCounter hours={hours} minutes={minutes} seconds={seconds} />
        <View style={styles.buttonRow}>
          {!isTimer || time > 0 ? (
            <>
              <Button
                onPress={togglePause}
                containerStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
              >
                {status === "running" ? "Pause" : "Resume"}
              </Button>
              <Button
                onPress={stop}
                containerStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
              >
                Stop
              </Button>
            </>
          ) : (
            <Button
              onPress={stop}
              containerStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
            >
              Stop
            </Button>
          )}
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { width: Dimensions.get("screen").width },
  title: { paddingBottom: 16 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  buttonContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonRow: {
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
