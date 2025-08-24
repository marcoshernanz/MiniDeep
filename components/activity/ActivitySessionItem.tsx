import getColor from "@/lib/utils/getColor";
import { StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import { ClockIcon, TimerIcon } from "lucide-react-native";
import { format } from "date-fns";
import calculateSessionDuration from "@/lib/sessions/calculateSessionDuration";
import formatTime from "@/lib/utils/formatTime";
import Button from "../ui/Button";

interface Props {
  session: WorkSession;
  showDate?: boolean;
}

export default function ActivitySessionItem({
  session,
  showDate = false,
}: Props) {
  const Icon = session.type === "timer" ? ClockIcon : TimerIcon;
  const date = showDate
    ? format(session.createdAt, "MMM dd, HH:mm")
    : format(session.createdAt, "HH:mm");
  const duration = calculateSessionDuration(session);
  const finished =
    session.type === "stopwatch" || session.inputDuration === duration;

  return (
    <View style={styles.container}>
      <Button
        variant="ghost"
        containerStyle={styles.buttonContainer}
        pressableStyle={styles.buttonPressable}
        android_ripple={{ color: getColor("muted") }}
        text={false}
        onPress={() => {}}
      >
        <View style={styles.iconContainer}>
          <Icon size={20} strokeWidth={1.75} color={getColor("primary")} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{date}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{formatTime(duration)}</Text>
          <View
            style={[
              styles.finishedCircle,
              {
                backgroundColor: finished
                  ? getColor("green", 0.75)
                  : getColor("red", 0.75),
              },
            ]}
          ></View>
        </View>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonContainer: {
    borderRadius: 8,
  },
  buttonPressable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  iconContainer: {
    height: 36,
    width: 36,
    borderRadius: 8,
    backgroundColor: getColor("muted"),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  primaryText: {
    color: getColor("foreground"),
    fontWeight: 600,
  },
  durationContainer: {
    marginLeft: "auto",
    paddingRight: 4,
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  durationText: {
    color: getColor("mutedForeground"),
  },
  finishedCircle: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
});
