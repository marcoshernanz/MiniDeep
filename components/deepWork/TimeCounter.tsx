import getColor from "@/lib/utils/getColor";
import { Platform, StyleSheet, View } from "react-native";
import Text from "../ui/Text";

interface Props {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeCounter({ hours, minutes, seconds }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{String(hours).padStart(2, "0")}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.text}>{String(minutes).padStart(2, "0")}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.text}>{String(seconds).padStart(2, "0")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: getColor("primary"),
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  text: {
    fontSize: 46,
    fontWeight: 400,
    letterSpacing: -2.5,
    fontVariant: ["tabular-nums"],
    ...(Platform.OS === "android" ? { fontFeatureSettings: "tnum" } : {}),
  },
  colon: {
    fontSize: 36,
    fontWeight: 300,
  },
});
