import AsyncStorage from "@react-native-async-storage/async-storage";
import timerStateConfig from "@/config/timerStateConfig";
import { TimerState, TimerStateSchema } from "@/zod/schemas/TimerStateSchema";

export default async function getTimerState(): Promise<TimerState | null> {
  try {
    const { storageKey } = timerStateConfig;
    const data = await AsyncStorage.getItem(storageKey);
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    const validationResult = TimerStateSchema.safeParse(parsedData);

    if (validationResult.success) {
      return {
        ...validationResult.data,
        date: new Date(validationResult.data.date),
      };
    } else {
      console.error("Timer state validation failed:", validationResult.error);
      return null;
    }
  } catch (error) {
    console.error("Error getting or validating timer state:", error);
    return null;
  }
}
