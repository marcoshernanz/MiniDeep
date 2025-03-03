import timeTrackingConfig, { WorkSession } from "@/config/timeTrackingConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function saveWorkSessions(
  sessions: WorkSession[],
): Promise<void> {
  const { storageKey } = timeTrackingConfig;

  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving work sessions:", error);
  }
}
