import timeTrackingConfig from "@/config/timeTrackingConfig";
import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

export default async function saveWorkSessions(
  sessions: WorkSession[],
): Promise<void> {
  const { storageKey } = timeTrackingConfig;

  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(sessions));
    DeviceEventEmitter.emit("sessionsChanged");
  } catch (error) {
    console.error("Error saving work sessions:", error);
  }
}
