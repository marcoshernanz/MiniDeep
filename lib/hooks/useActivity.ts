import { useCallback, useEffect, useState } from "react";
import { startOfDay } from "date-fns";
import getWorkSessions from "../time-tracking/getWorkSessions";
import getTimeDistribution from "../time-tracking/getTimeDistribution";
import calculateSessionDuration from "../time-tracking/calculateSessionDuration";

export type ActivityType = {
  date: Date;
  totalSessions: number;
  totalWorkTime: number;
  sessions: {
    startDate: Date;
    duration: number;
    completed: boolean;
  }[];
  timeDistribution: {
    time: number;
    duration: number;
  }[];
};

export default function useActivity() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityType[]>([]);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const sessionsData = await getWorkSessions();
      const timeDistributionData = await getTimeDistribution();

      const activityMap = new Map<string, ActivityType>();

      timeDistributionData.forEach((dist) => {
        const dateKey = dist.date.toISOString().split("T")[0];
        if (!activityMap.has(dateKey)) {
          activityMap.set(dateKey, {
            date: startOfDay(dist.date),
            totalSessions: 0,
            totalWorkTime: 0,
            sessions: [],
            timeDistribution: dist.distribution.map((d) => ({
              time: d.hour,
              duration: d.time,
            })),
          });
        }
      });

      sessionsData.forEach((session) => {
        const dateKey = session.startDate.toISOString().split("T")[0];
        const sessionDuration = calculateSessionDuration(session);

        const isCompleted = sessionDuration === session.plannedDuration;

        let dayActivity = activityMap.get(dateKey);

        if (!dayActivity) {
          const defaultTimeDistribution = Array.from(
            { length: 24 },
            (_, hour) => ({ time: hour, duration: 0 }),
          );
          dayActivity = {
            date: startOfDay(session.startDate),
            totalSessions: 0,
            totalWorkTime: 0,
            sessions: [],
            timeDistribution: defaultTimeDistribution,
          };
          activityMap.set(dateKey, dayActivity);
        }

        dayActivity.totalSessions += 1;
        // Only add duration if the session is considered completed for total work time calculation?
        // Or should incomplete sessions also count towards total time?
        // Assuming completed sessions contribute to totalWorkTime for now.
        if (isCompleted) {
          dayActivity.totalWorkTime += sessionDuration;
        }

        dayActivity.sessions.push({
          startDate: session.startDate,
          duration: sessionDuration,
          completed: isCompleted, // Use derived completion status
        });
      });

      // Sort the activity array by date descending
      const processedActivity = Array.from(activityMap.values()).sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );

      setActivity(processedActivity);
    } catch (error) {
      console.error("Failed to load activity:", error);
      // Optionally set an error state here
      setActivity([]); // Reset or keep previous state? Resetting for now.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]); // Re-enable useEffect

  return { activity, loading, refresh: loadActivity };
}
