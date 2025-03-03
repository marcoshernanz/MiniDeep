import timeTrackingConfig, { WorkSession } from "@/config/timeTrackingConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getWorkSessions(): Promise<WorkSession[]> {
  const { storageKey } = timeTrackingConfig;

  try {
    const data = await AsyncStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading work sessions:", error);
    return [];
  }
}
