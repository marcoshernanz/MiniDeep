import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import Button from "../ui/Button";
import TimeCounter from "./TimeCounter";
import useStopwatch from "@/lib/hooks/useStopwatch";

export default function DeepWorkStopwatch() {
  const { start } = useStopwatch();

  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Stopwatch</Title>
      <View style={styles.container}>
        <TimeCounter hours={0} minutes={0} seconds={0} />
        <Button
          onPress={() => start()}
          containerStyle={styles.startButtonContainer}
          textStyle={styles.startButtonText}
        >
          Start
        </Button>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: Dimensions.get("screen").width,
  },
  title: {
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  startButtonContainer: {
    width: 194,
  },
  startButtonText: {
    fontSize: 16,
  },
});
