import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { useState } from "react";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";

export default function DeepWorkTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  console.log(hours);

  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Timer</Title>
      <View style={styles.container}>
        <View style={styles.box}></View>
        <WheelNumberPicker
          value={hours}
          onValueChange={setHours}
          height={250}
          min={0}
          max={23}
          padWithZeros
        />
        <Text style={styles.middleDots}>:</Text>
        <WheelNumberPicker
          value={minutes}
          onValueChange={setMinutes}
          height={250}
          min={0}
          max={59}
          interval={5}
          padWithZeros
        />
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
    gap: 12,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
  box: {
    borderWidth: 2,
    borderColor: getColor("primary"),
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    transform: [{ translateY: "-50%" }],
    width: 190,
    height: 60,
    borderRadius: 8,
  },
  middleDots: {
    fontSize: 42,
    fontWeight: 900,
    transform: [{ translateY: -5 }],
  },
});
