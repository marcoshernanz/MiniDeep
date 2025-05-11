import { storage } from "@/lib/storage/mmkv";
import timeTrackingConfig from "@/config/timeTrackingConfig";
import {
  WorkSession,
  WorkSessionSchema,
} from "@/zod/schemas/WorkSessionSchema";
import { z } from "zod";

const WorkSessionArraySchema = z.array(WorkSessionSchema);

export default function getWorkSessions(): WorkSession[] {
  const { storageKey } = timeTrackingConfig;

  try {
    const data = storage.getString(storageKey);
    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);
    const validationResult = WorkSessionArraySchema.safeParse(parsedData);

    if (validationResult.success) {
      return validationResult.data;
    } else {
      console.error("Work sessions validation failed:", validationResult.error);
      return [];
    }
  } catch (error) {
    console.error("Error loading or validating work sessions:", error);
    return [];
  }
}
