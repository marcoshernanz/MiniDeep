import { storage } from "@/lib/storage/mmkv";
import timerStateConfig from "@/config/timerStateConfig";
import { TimerState, TimerStateSchema } from "@/zod/schemas/TimerStateSchema";

export default function getTimerState(): TimerState | null {
  try {
    const { storageKey } = timerStateConfig;
    const data = storage.getString(storageKey);
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    const validationResult = TimerStateSchema.safeParse(parsedData);

    if (validationResult.success) {
      return validationResult.data;
    } else {
      console.error("Timer state validation failed:", validationResult.error);
      return null;
    }
  } catch (error) {
    console.error("Error getting or validating timer state:", error);
    return null;
  }
}
