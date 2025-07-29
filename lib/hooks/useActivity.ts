import { useAppContext } from "@/context/AppContext";
import { AppData } from "@/zod/schemas/AppDataSchema";
import { useMemo } from "react";
import useHourlyWorkDistribution from "./statistics/useHourlyWorkDistribution";
import { eachDayOfInterval, formatISO } from "date-fns";

export type ActivityEntry = {
  date: Date;
  totalTime: number;
  totalSessions: number;
  workDistribution: Record<string, number>;
  sessions: AppData["sessions"];
};

export default function useActivity(): ActivityEntry[] {
  const { appData } = useAppContext();
  const workDistribution = useHourlyWorkDistribution();

  return useMemo(() => {
    const sessions = appData.sessions;

    if (sessions.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const key = formatISO(today, { representation: "date" });
      return [
        {
          date: today,
          totalTime: 0,
          totalSessions: 0,
          workDistribution: workDistribution[key] ?? {},
          sessions: [],
        },
      ];
    }

    const byDate: Record<string, AppData["sessions"]> = sessions.reduce(
      (acc, session) => {
        const key = formatISO(session.createdAt, { representation: "date" });
        if (!acc[key]) acc[key] = [];
        acc[key].push(session);
        return acc;
      },
      {} as Record<string, AppData["sessions"]>
    );

    const firstDate = sessions.reduce(
      (min, session) => (session.createdAt < min ? session.createdAt : min),
      sessions[0].createdAt
    );
    const start = new Date(firstDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const days = eachDayOfInterval({ start, end });

    return days.map((day: Date) => {
      const key = formatISO(day, { representation: "date" });
      const sessionsForDay = byDate[key] ?? [];
      const distForDay = workDistribution[key] ?? {};
      const totalTime = Object.values(distForDay).reduce(
        (sum, v) => sum + v,
        0
      );
      const totalSessions = sessionsForDay.length;

      return {
        date: day,
        totalTime,
        totalSessions,
        workDistribution: distForDay,
        sessions: sessionsForDay,
      };
    });
  }, [appData.sessions, workDistribution]);
}
