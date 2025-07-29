import getColor from "@/lib/utils/getColor";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import formatTime from "@/lib/utils/formatTime";

interface Props {
  totalTime: number;
  totalSessions: number;
}

export default function ActivityOverview({ totalTime, totalSessions }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Overview</Text>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Time</Text>
          <Text style={styles.cardValue}>{formatTime(totalTime)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Sessions</Text>
          <Text style={styles.cardValue}>{totalSessions}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 12,
  },
  cardsContainer: {
    gap: 12,
    flexDirection: "row",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    padding: 16,
    gap: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: getColor("mutedForeground"),
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
