import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import Button from "../ui/Button";

export default function DeepWorkStopwatch() {
  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Stopwatch</Title>
      <View style={styles.container}>
        <Button>Start</Button>
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
  },
});
