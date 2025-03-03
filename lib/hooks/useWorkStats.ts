import { useState, useEffect, useCallback } from "react";
import { getWorkSessions, WorkSession } from "../utils/timeTracking";

export type WorkStats = {
  totalSessions: number;
  totalWorkTime: number; // in seconds
  completedSessions: number;
  lastSessionDate: Date | null;
  dailyStats: {
    date: string;
    totalTime: number;
  }[];
};

export const useWorkStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkStats>({
    totalSessions: 0,
    totalWorkTime: 0,
    completedSessions: 0,
    lastSessionDate: null,
    dailyStats: [],
  });

  const [sessions, setSessions] = useState<WorkSession[]>([]);

  const calculateWorkTime = (session: WorkSession): number => {
    if (session.events.length === 0) return 0;

    // Calculate actual work time based on events
    let workTime = 0;
    let lastStartTime: number | null = null;

    for (const event of session.events) {
      if (event.action === "start" || event.action === "resume") {
        lastStartTime = event.timestamp;
      } else if (
        (event.action === "pause" ||
          event.action === "stop" ||
          event.action === "complete") &&
        lastStartTime
      ) {
        workTime += (event.timestamp - lastStartTime) / 1000;
        lastStartTime = null;
      }
    }

    return workTime;
  };

  const generateDailyStats = (sessions: WorkSession[]) => {
    const dailyMap = new Map<string, number>();

    sessions.forEach((session) => {
      const date = new Date(session.startTime).toISOString().split("T")[0];
      const sessionTime = calculateWorkTime(session);

      const currentTime = dailyMap.get(date) || 0;
      dailyMap.set(date, currentTime + sessionTime);
    });

    return Array.from(dailyMap)
      .map(([date, totalTime]) => ({
        date,
        totalTime,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Memoize loadStats to prevent it from changing on every render
  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const allSessions = await getWorkSessions();
      setSessions(allSessions);

      let totalWorkTime = 0;
      const completedSessions = allSessions.filter((s) => s.completed).length;

      allSessions.forEach((session) => {
        totalWorkTime += calculateWorkTime(session);
      });

      const lastSessionDate =
        allSessions.length > 0
          ? new Date(Math.max(...allSessions.map((s) => s.startTime)))
          : null;

      const dailyStats = generateDailyStats(allSessions);

      setStats({
        totalSessions: allSessions.length,
        totalWorkTime,
        completedSessions,
        lastSessionDate,
        dailyStats,
      });
    } catch (error) {
      console.error("Error loading work stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    sessions,
    loading,
    refresh: loadStats,
  };
};
