import { useCallback, useEffect, useState } from "react";
import getWorkSessions from "../time-tracking/getWorkSessions";
import { addDays, subDays } from "date-fns";

export type ActivityType = {
  date: Date;
  totalSessions: number;
  totalWorkTime: number;
  sessions: {
    startTime: Date;
    duration: number;
    completed: boolean;
  }[];
};

const MockActivity: ActivityType[] = [
  {
    date: new Date(),
    totalSessions: 3,
    totalWorkTime: 7200,
    sessions: [
      {
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startTime: new Date(new Date().setHours(13, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
      {
        startTime: new Date(new Date().setHours(16, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
    ],
  },
  {
    date: subDays(new Date(), 1),
    totalSessions: 2,
    totalWorkTime: 5400,
    sessions: [
      {
        startTime: new Date(subDays(new Date(), 1).setHours(10, 0, 0, 0)),
        duration: 2700,
        completed: true,
      },
      {
        startTime: new Date(subDays(new Date(), 1).setHours(15, 0, 0, 0)),
        duration: 2700,
        completed: false,
      },
    ],
  },
  {
    date: subDays(new Date(), 2),
    totalSessions: 1,
    totalWorkTime: 1800,
    sessions: [
      {
        startTime: new Date(subDays(new Date(), 2).setHours(14, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
    ],
  },
  {
    date: subDays(new Date(), 3),
    totalSessions: 4,
    totalWorkTime: 10800,
    sessions: [
      {
        startTime: new Date(subDays(new Date(), 3).setHours(9, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startTime: new Date(subDays(new Date(), 3).setHours(11, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
      {
        startTime: new Date(subDays(new Date(), 3).setHours(14, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startTime: new Date(subDays(new Date(), 3).setHours(17, 0, 0, 0)),
        duration: 1800,
        completed: false,
      },
    ],
  },
  {
    date: subDays(new Date(), 4),
    totalSessions: 0,
    totalWorkTime: 0,
    sessions: [],
  },
  {
    date: subDays(new Date(), 5),
    totalSessions: 2,
    totalWorkTime: 5400,
    sessions: [
      {
        startTime: new Date(subDays(new Date(), 5).setHours(10, 30, 0, 0)),
        duration: 2700,
        completed: true,
      },
      {
        startTime: new Date(subDays(new Date(), 5).setHours(16, 30, 0, 0)),
        duration: 2700,
        completed: true,
      },
    ],
  },
  {
    date: subDays(new Date(), 6),
    totalSessions: 1,
    totalWorkTime: 5400,
    sessions: [
      {
        startTime: new Date(subDays(new Date(), 6).setHours(14, 0, 0, 0)),
        duration: 5400,
        completed: true,
      },
    ],
  },
];

export default function useActivity() {
  // const [loading, setLoading] = useState(true);
  // const [activity, setActivity] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityType[]>(MockActivity);

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

  // useEffect(() => {
  // loadActivity();
  // }, [loadActivity]);

  return { activity, loading, refresh: loadActivity };
}
