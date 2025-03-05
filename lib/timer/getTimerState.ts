import AsyncStorage from "@react-native-async-storage/async-storage";
import timerStateConfig, { TimerState } from "@/config/timerStateConfig";

export default async function getTimerState(): Promise<TimerState | null> {
  try {
    const { storageKey } = timerStateConfig;
    const data = await AsyncStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting timer state:", error);
    return null;
  }
}
