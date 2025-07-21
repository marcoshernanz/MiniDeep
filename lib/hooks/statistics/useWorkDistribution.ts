import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";

export default function useWorkDistribution(): Record<
  string,
  Record<string, number>
> {
  const { appData } = useAppContext();

  return useMemo(() => {
    const intervals = appData.sessions.flatMap((session) =>
      session.type === "timer"
        ? session.events.map(({ start, stop: end }) => ({ start, end }))
        : session.intervals
    );
  }, [appData.sessions]);
}
