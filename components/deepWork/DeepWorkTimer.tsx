import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import WheelNumberPicker from "../ui/WheelNumberPicker";

export default function DeepWorkTimer() {
  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Timer</Title>
      <View style={styles.container}>
        <WheelNumberPicker height={250} min={0} max={60} padWithZeros />
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
