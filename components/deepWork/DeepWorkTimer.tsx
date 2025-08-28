import { Dimensions, StyleSheet, View } from "react-native";
import useTimer from "@/lib/hooks/useTimer";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import Button from "../ui/Button";
import getTime from "@/lib/utils/getTime";
import AlertDialog from "../ui/AlertDialog";
import * as Linking from "expo-linking";

export default function DeepWorkTimer() {
  const { appData, setAppData } = useAppContext();
  const { hours, minutes } = appData.state.timer;

  const { start } = useTimer();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  useEffect(() => {
    if (hours === 0 && minutes === 0) {
      setAppData((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          timer: { hours: 0, minutes: 5 },
        },
      }));
    }
  }, [hours, minutes, setAppData]);

  return (
    <SafeArea style={styles.safeArea}>
      <Title style={styles.title}>Timer</Title>
      <View style={styles.container}>
        <View style={styles.timePickerContainer}>
          <View style={styles.box}></View>
          <WheelNumberPicker
            value={hours}
            onValueChange={(h) =>
              setAppData((prev) => ({
                ...prev,
                state: {
                  ...prev.state,
                  timer: { hours: h, minutes: prev.state.timer.minutes },
                },
              }))
            }
            height={250}
            min={0}
            max={23}
            padWithZeros
          />
          <Text style={styles.colon}>:</Text>
          <WheelNumberPicker
            value={minutes}
            onValueChange={(m) =>
              setAppData((prev) => ({
                ...prev,
                state: {
                  ...prev.state,
                  timer: { hours: prev.state.timer.hours, minutes: m },
                },
              }))
            }
            height={250}
            min={0}
            max={59}
            interval={5}
            padWithZeros
          />
        </View>
        <Button
          onPress={async () => {
            const duration = getTime({ hours, minutes });
            const result = await start(duration);
            if (result === "permission-denied") {
              setShowPermissionDialog(true);
            }
          }}
          containerStyle={styles.startButtonContainer}
          textStyle={styles.startButtonText}
        >
          Start
        </Button>
      </View>
      <AlertDialog
        visible={showPermissionDialog}
        title="Enable Notifications"
        content="To alert you when the timer finishes, enable notifications in system settings."
        confirmText="Open Settings"
        onCancel={async () => setShowPermissionDialog(false)}
        onConfirm={async () => {
          await Linking.openSettings();
          setShowPermissionDialog(false);
        }}
      />
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
  colon: {
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
