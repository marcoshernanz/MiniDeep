import { useMemo } from "react";
import { FlatList, StyleSheet, View, Platform } from "react-native";
import Text from "./Text";
import { LinearGradient } from "expo-linear-gradient";
import getColor from "@/lib/utils/getColor";

interface Props {
  height: number;
  fontSize?: number;
  min: number;
  max: number;
  interval?: number;
  padWithZeros?: boolean;
}

export default function WheelNumberPicker({
  height,
  fontSize = 50,
  min,
  max,
  interval = 1,
  padWithZeros = false,
}: Props) {
  const values = useMemo(() => {
    const result = [];
    for (let i = min; i <= max; i += interval) {
      result.push(i);
    }
    return result;
  }, [min, max, interval]);

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        data={values}
        showsVerticalScrollIndicator={false}
        snapToInterval={height / 3}
        decelerationRate="fast"
        overScrollMode="never"
        renderItem={({ item }) => (
          <Text style={[styles.text, { height: height / 3, fontSize }]}>
            {item
              .toString()
              .padStart(padWithZeros ? max.toString().length : 0, "0")}
          </Text>
        )}
      />

      <LinearGradient
        colors={[getColor("background"), getColor("background", 0)]}
        style={[styles.gradient, { height: height / 3, top: 0 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[getColor("background", 0), getColor("background")]}
        style={[styles.gradient, { height: height / 3, bottom: 0 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  text: {
    fontWeight: 400,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    ...(Platform.OS === "android" ? { fontFeatureSettings: "tnum" } : {}),
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
