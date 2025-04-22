import timeTrackingConfig from "@/config/timeTrackingConfig";
import {
  WorkSession,
  WorkSessionSchema,
} from "@/zod/schemas/WorkSessionSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const WorkSessionArraySchema = z.array(WorkSessionSchema);

export default async function getWorkSessions(): Promise<WorkSession[]> {
  const { storageKey } = timeTrackingConfig;

  try {
    const data = await AsyncStorage.getItem(storageKey);
    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);
    const validationResult = WorkSessionArraySchema.safeParse(parsedData);

    if (validationResult.success) {
      return validationResult.data.map((session) => ({
        ...session,
        startDate: new Date(session.startDate),
        events: session.events.map((event) => ({
          ...event,
          date: new Date(event.date),
        })),
      }));
    } else {
      console.error("Work sessions validation failed:", validationResult.error);
      return [];
    }
  } catch (error) {
    console.error("Error loading or validating work sessions:", error);
    return [];
  }
}
