import getWorkSessions from "./getWorkSessions";
import { eachDayOfInterval, startOfDay } from "date-fns";

type TimeDistribution = {
  date: Date;
  distribution: {
    hour: number;
    time: number;
  }[];
}[];

const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const createDefaultHourlyDistribution = (): {
  hour: number;
  time: number;
}[] => {
  return Array.from({ length: 24 }, (_, hour) => ({ hour, time: 0 }));
};

export default async function getTimeDistribution(): Promise<TimeDistribution> {
  const sessions = (await getWorkSessions()).sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  const distributionMap = new Map<string, { hour: number; time: number }[]>();

  if (sessions.length > 0) {
    const earliestSessionDate = startOfDay(sessions[0].startDate);
    const today = startOfDay(new Date());

    const dateInterval = eachDayOfInterval({
      start: earliestSessionDate,
      end: today,
    });

    for (const date of dateInterval) {
      const dateKey = getDateKey(date);
      distributionMap.set(dateKey, createDefaultHourlyDistribution());
    }
  } else {
    const todayKey = getDateKey(new Date());
    distributionMap.set(todayKey, createDefaultHourlyDistribution());
  }
  const events = sessions.flatMap((session) => session.events);

  for (let i = 0; i < events.length - 1; i++) {
    const currentEvent = events[i];
    const nextEvent = events[i + 1];

    if (currentEvent.action !== "start" || nextEvent.action !== "stop") {
      continue;
    }

    const time = nextEvent.date.getTime() - currentEvent.date.getTime();

    if (time <= 0) continue;

    const eventStartDate = currentEvent.date;
    const dateKey = getDateKey(eventStartDate);
    const startHour = eventStartDate.getHours();

    const hourlyDistribution = distributionMap.get(dateKey);

    if (!hourlyDistribution) continue;

    const hourEntry = hourlyDistribution.find(
      (entry) => entry.hour === startHour,
    );

    if (hourEntry) {
      hourEntry.time += time;
    }
  }

  const distributionResult: TimeDistribution = Array.from(
    distributionMap.entries(),
  ).map(([dateString, hourlyDist]) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const resultDate = new Date(year, month - 1, day);

    return {
      date: resultDate,
      distribution: hourlyDist,
    };
  });

  return distributionResult;
}
