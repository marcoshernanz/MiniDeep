import { trackerStateConfig } from "@/config/trackerStateConfig";
import { storage } from "@/lib/storage/mmkv";
import {
  TrackerState,
  TrackerStateSchema,
} from "@/zod/schemas/TrackerStateSchema";

export default function getTrackerState(): TrackerState | null {
  try {
    const { storageKey } = trackerStateConfig;
    const data = storage.getString(storageKey);
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data);
    const validationResult = TrackerStateSchema.safeParse(parsedData);

    if (validationResult.success) {
      return validationResult.data;
    } else {
      console.error("Tracker state validation failed:", validationResult.error);
      return null;
    }
  } catch (error) {
    console.error("Error getting or validating tracker state:", error);
    return null;
  }
}
