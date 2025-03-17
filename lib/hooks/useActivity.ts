import { useCallback, useEffect, useState } from "react";
import getWorkSessions from "../time-tracking/getWorkSessions";

type ActivityType = {
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
  const [activity, setActivity] = useState<ActivityType>({
    totalSessions: 0,
    totalWorkTime: 0,
    sessions: [],
  });

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const allSessions = await getWorkSessions();
      const filteredSessions = allSessions.filter(
        (session) => session.endTime !== null,
      );
      const sessions = filteredSessions.map((session) => ({
        startTime: new Date(session.startTime),
        duration: session.duration,
        completed: session.completed,
      }));

      const totalSessions = sessions.length;

      const totalWorkTime = sessions.reduce(
        (acc, session) => acc + session.duration,
        0,
      );

      setActivity({ totalSessions, totalWorkTime, sessions });
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
