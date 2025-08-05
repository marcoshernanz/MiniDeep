import { useAppContext } from "@/context/AppContext";
import SettingsGroup from "../SettingsGroup";
import SettingsItem from "../SettingsItem";
import { Toast } from "@/components/ui/Toast";
import Constants from "expo-constants";
import uuidv4 from "@/lib/utils/uuidv4";
import type { WorkSession } from "@/zod/schemas/WorkSessionSchema";

export default function DummyData() {
  const { setAppData } = useAppContext();
  const appVariant = Constants.expoConfig?.extra?.APP_VARIANT;
  const showDummyData =
    appVariant === "development" || appVariant === "preview";

  if (!showDummyData) return null;

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateRandomDurations = (totalMs: number, count: number) => {
    const weights = Array.from({ length: count }, () => Math.random());
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    const durations = weights.map((w) =>
      Math.floor((w / sumWeights) * totalMs)
    );
    let diff = totalMs - durations.reduce((a, b) => a + b, 0);
    let idx = 0;
    while (diff > 0) {
      durations[idx % count]++;
      idx++;
      diff--;
    }
    return durations;
  };

  const loadDummyData = () => {
    const sessions: WorkSession[] = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const sessionCount = getRandomInt(3, 10);
      const totalHours = getRandomInt(2, 12);
      const totalMs = totalHours * 3600 * 1000;
      const durations = generateRandomDurations(totalMs, sessionCount);
      let offset = 0;
      for (let j = 0; j < sessionCount; j++) {
        const sessionMs = durations[j];
        const start = new Date(day.getTime() + offset);
        const end = new Date(start.getTime() + sessionMs);
        offset += sessionMs;
        sessions.push({
          id: uuidv4(),
          createdAt: start,
          type: "timer",
          status: "finished",
          inputDuration: sessionMs,
          events: [{ start, stop: end }],
        });
      }
    }
    setAppData(() => ({ sessions }));

    Toast.show({ text: "Dummy data loaded", variant: "success" });
  };

  const clearDummyData = () => {
    setAppData(() => ({
      sessions: [],
    }));

    Toast.show({ text: "Dummy data cleared", variant: "success" });
  };

  return (
    <SettingsGroup>
      <SettingsItem text="Load Dummy Data" onPress={loadDummyData} />
      <SettingsItem text="Clear Dummy Data" onPress={clearDummyData} />
    </SettingsGroup>
  );
}
