import { useCallback, useEffect, useState } from "react";
import getWorkSessions from "../time-tracking/getWorkSessions";
import { addDays, subDays } from "date-fns";
import { TimeEvent } from "@/config/timeTrackingConfig";

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

const MockActivity: ActivityType[] = [
  {
    date: new Date(),
    totalSessions: 3,
    totalWorkTime: 7200,
    sessions: [
      {
        startDate: new Date(new Date().setHours(9, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startDate: new Date(new Date().setHours(13, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
      {
        startDate: new Date(new Date().setHours(16, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 60 },
      { time: 10, duration: 0 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 30 },
      { time: 14, duration: 0 },
      { time: 15, duration: 0 },
      { time: 16, duration: 30 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 1),
    totalSessions: 2,
    totalWorkTime: 5400,
    sessions: [
      {
        startDate: new Date(subDays(new Date(), 1).setHours(10, 0, 0, 0)),
        duration: 2700,
        completed: true,
      },
      {
        startDate: new Date(subDays(new Date(), 1).setHours(15, 0, 0, 0)),
        duration: 2700,
        completed: false,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 0 },
      { time: 10, duration: 45 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 0 },
      { time: 15, duration: 45 },
      { time: 16, duration: 0 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 2),
    totalSessions: 1,
    totalWorkTime: 1800,
    sessions: [
      {
        startDate: new Date(subDays(new Date(), 2).setHours(14, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 0 },
      { time: 10, duration: 0 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 30 },
      { time: 15, duration: 0 },
      { time: 16, duration: 0 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 3),
    totalSessions: 4,
    totalWorkTime: 10800,
    sessions: [
      {
        startDate: new Date(subDays(new Date(), 3).setHours(9, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startDate: new Date(subDays(new Date(), 3).setHours(11, 0, 0, 0)),
        duration: 1800,
        completed: true,
      },
      {
        startDate: new Date(subDays(new Date(), 3).setHours(14, 0, 0, 0)),
        duration: 3600,
        completed: true,
      },
      {
        startDate: new Date(subDays(new Date(), 3).setHours(17, 0, 0, 0)),
        duration: 1800,
        completed: false,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 60 },
      { time: 10, duration: 0 },
      { time: 11, duration: 30 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 60 },
      { time: 15, duration: 0 },
      { time: 16, duration: 0 },
      { time: 17, duration: 30 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 4),
    totalSessions: 0,
    totalWorkTime: 0,
    sessions: [],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 0 },
      { time: 10, duration: 0 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 0 },
      { time: 15, duration: 0 },
      { time: 16, duration: 0 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 5),
    totalSessions: 2,
    totalWorkTime: 5400,
    sessions: [
      {
        startDate: new Date(subDays(new Date(), 5).setHours(10, 30, 0, 0)),
        duration: 2700,
        completed: true,
      },
      {
        startDate: new Date(subDays(new Date(), 5).setHours(16, 30, 0, 0)),
        duration: 2700,
        completed: true,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 0 },
      { time: 10, duration: 45 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 0 },
      { time: 15, duration: 0 },
      { time: 16, duration: 45 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
  {
    date: subDays(new Date(), 6),
    totalSessions: 1,
    totalWorkTime: 5400,
    sessions: [
      {
        startDate: new Date(subDays(new Date(), 6).setHours(14, 0, 0, 0)),
        duration: 5400,
        completed: true,
      },
    ],
    timeDistribution: [
      { time: 0, duration: 0 },
      { time: 1, duration: 0 },
      { time: 2, duration: 0 },
      { time: 3, duration: 0 },
      { time: 4, duration: 0 },
      { time: 5, duration: 0 },
      { time: 6, duration: 0 },
      { time: 7, duration: 0 },
      { time: 8, duration: 0 },
      { time: 9, duration: 0 },
      { time: 10, duration: 0 },
      { time: 11, duration: 0 },
      { time: 12, duration: 0 },
      { time: 13, duration: 0 },
      { time: 14, duration: 60 },
      { time: 15, duration: 0 },
      { time: 16, duration: 0 },
      { time: 17, duration: 0 },
      { time: 18, duration: 0 },
      { time: 19, duration: 0 },
      { time: 20, duration: 0 },
      { time: 21, duration: 0 },
      { time: 22, duration: 0 },
      { time: 23, duration: 0 },
    ],
  },
].toReversed();

export default function useActivity() {
  // const [loading, setLoading] = useState(true);
  // const [activity, setActivity] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityType[]>(MockActivity);

  const getTimeDistribution = useCallback((events: TimeEvent[]) => {
    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    const timeDistribution: { time: number; duration: number }[] = Array.from(
      { length: 24 },
      (_, index) => ({ time: index, duration: 0 }),
    );

    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i];
      const nextEvent = events[i + 1];

      if (!["start", "resume"].includes(currentEvent.action)) {
        continue;
      }

      const currentHour = currentEvent.date.getHours();
      const duration = Math.floor(
        (nextEvent.date.getTime() - currentEvent.date.getTime()) / 1000 / 60,
      );

      timeDistribution[currentHour].duration += duration;
    }

    return timeDistribution;
  }, []);

  const loadActivity = useCallback(async () => {
    setLoading(true);

    const sessions = (await getWorkSessions())
      .filter((session) => session.endDate !== null)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    const activity: ActivityType[] = [];

    if (sessions.length === 0) {
      setActivity([]);
      return;
    }

    const startDate = new Date(sessions[0].startDate);
    const today = new Date();

    const sessionsByDate = new Map<string, typeof sessions>();

    for (const session of sessions) {
      const dateKey = session.startDate.toISOString().split("T")[0];
      if (!sessionsByDate.has(dateKey)) {
        sessionsByDate.set(dateKey, []);
      }
      sessionsByDate.get(dateKey)!.push(session);
    }

    let currentDate = startDate;
    while (currentDate <= today) {
      const dateKey = currentDate.toISOString().split("T")[0];
      const sessions = sessionsByDate.get(dateKey) || [];

      const events = sessions.map((session) => session.events).flat();

      const timeDistribution = getTimeDistribution(events);
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
        timeDistribution,
      });

      currentDate = addDays(currentDate, 1);
    }

    setActivity(activity);
    setLoading(false);
  }, []);

  // useEffect(() => {
  // loadActivity();
  // }, [loadActivity]);

  return { activity, loading, refresh: loadActivity };
}
