import { useCallback, useEffect, useState } from "react";
import getWorkSessions from "../time-tracking/getWorkSessions";
import { addDays } from "date-fns";

type ActivityType = {
  date: Date;
  totalSessions: number;
  totalWorkTime: number;
  sessions: {
    startTime: Date;
    duration: number;
    completed: boolean;
  }[];
};

export default function useActivity() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityType[]>([]);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const allSessions = await getWorkSessions();
      const filteredSessions = allSessions.filter(
        (session) => session.endTime !== null,
      );
      const formattedSessions = filteredSessions.map((session) => ({
        startTime: new Date(session.startTime),
        duration: session.duration,
        completed: session.completed,
        date: new Date(session.startTime),
      }));
      const sortedSessions = formattedSessions.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );

      const activity: ActivityType[] = [];

      if (sortedSessions.length === 0) {
        setActivity([]);
        return;
      }

      const startDate = new Date(sortedSessions[0].date);
      const today = new Date();

      const sessionsByDate = new Map<string, typeof sortedSessions>();

      for (const session of sortedSessions) {
        const dateKey = session.date.toISOString().split("T")[0];
        if (!sessionsByDate.has(dateKey)) {
          sessionsByDate.set(dateKey, []);
        }
        sessionsByDate.get(dateKey)!.push(session);
      }

      let currentDate = startDate;
      while (currentDate <= today) {
        const dateKey = currentDate.toISOString().split("T")[0];
        const sessions = sessionsByDate.get(dateKey) || [];

        const totalSessions = sessions.length;
        const totalWorkTime = sessions.reduce(
          (acc, session) => acc + session.duration,
          0,
        );

        activity.push({
          date: new Date(currentDate),
          totalSessions,
          totalWorkTime,
          sessions,
        });

        currentDate = addDays(currentDate, 1);
      }

      setActivity(activity);
    } catch (error) {
      console.error("Error loading work stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  return { activity, loading, refresh: loadActivity };
}
