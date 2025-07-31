import { Dimensions, StyleSheet, View } from "react-native";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { useState, useEffect } from "react";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import Button from "../ui/Button";

export default function DeepWorkTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  // Reset to 5 minutes if time reaches 0:00
  useEffect(() => {
    if (hours === 0 && minutes === 0) {
      setMinutes(5);
    }
  }, [hours, minutes]);

  console.log(hours);

  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Timer</Title>
      <View style={styles.container}>
        <View style={styles.timePickerContainer}>
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
        <Button
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
    gap: 36,
  },
  timePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
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
  startButtonContainer: {
    width: 194,
  },
  startButtonText: {
    fontSize: 16,
  },
});
