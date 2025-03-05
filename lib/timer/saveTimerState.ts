import AsyncStorage from "@react-native-async-storage/async-storage";
import timerStateConfig, { TimerState } from "@/config/timerStateConfig";

export default async function saveTimerState(state: TimerState): Promise<void> {
  try {
    const { storageKey } = timerStateConfig;
    await AsyncStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving timer state:", error);
  }
}
