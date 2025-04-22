import { useCallback, useEffect, useState } from "react";
import { startOfDay } from "date-fns";
import getWorkSessions from "../time-tracking/getWorkSessions";
import getTimeDistribution from "../time-tracking/getTimeDistribution";
import calculateSessionDuration from "../time-tracking/calculateSessionDuration";

export type ActivityType = {
  date: Date;
  totalWorkTime: number;
  sessions: {
    startDate: Date;
    duration: number;
    completed: boolean;
  }[];
  timeDistribution: {
    hour: number;
    time: number;
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
            totalWorkTime: 0,
            sessions: [],
            timeDistribution: dist.distribution,
          });
        }
      });

      sessionsData.forEach((session) => {
        const dateKey = session.startDate.toISOString().split("T")[0];
        const sessionDuration = calculateSessionDuration(session);

        const isCompleted = sessionDuration === session.plannedDuration;

        let dayActivity = activityMap.get(dateKey);
        if (!dayActivity) return;

        dayActivity.totalWorkTime += sessionDuration;

        dayActivity.sessions.push({
          startDate: session.startDate,
          duration: sessionDuration,
          completed: isCompleted,
        });
      });

      const processedActivity = Array.from(activityMap.values()).sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );

      setActivity(processedActivity);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  return { activity, loading, refresh: loadActivity };
}
