import { trackerStateConfig } from "@/config/trackerStateConfig";
import { storage } from "@/lib/storage/mmkv";
import { TrackerState } from "@/zod/schemas/TrackerStateSchema";

export default function saveTrackerState(state: TrackerState): void {
  try {
    const { storageKey } = trackerStateConfig;
    storage.set(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving tracker state:", error);
  }
}
