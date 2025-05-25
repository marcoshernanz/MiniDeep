import { storage } from "@/lib/storage/mmkv";
import timeTrackingConfig from "@/config/timeTrackingConfig";
import { WorkSession } from "@/zod/schemas/WorkSessionSchema";
import { DeviceEventEmitter } from "react-native";

export default function saveWorkSessions(sessions: WorkSession[]): void {
  const { storageKey } = timeTrackingConfig;

  try {
    storage.set(storageKey, JSON.stringify(sessions));
    DeviceEventEmitter.emit("sessionsChanged");
  } catch (error) {
    console.error("Error saving work sessions:", error);
  }
}
