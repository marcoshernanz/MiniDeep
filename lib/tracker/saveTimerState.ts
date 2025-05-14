import { storage } from "@/lib/storage/mmkv";
import timerStateConfig from "@/config/timerStateConfig";
import { TimerState } from "@/zod/schemas/TimerStateSchema";

export default function saveTimerState(state: TimerState): void {
  try {
    const { storageKey } = timerStateConfig;
    storage.set(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving timer state:", error);
  }
}
