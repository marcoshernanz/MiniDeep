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
  return startOfDay(date).getTime().toString();
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

    const startDate = currentEvent.date;
    const endDate = nextEvent.date;
    let cursor = new Date(startDate);

    while (cursor < endDate) {
      const dateKeySegment = getDateKey(cursor);
      const hourlyDistributionSegment = distributionMap.get(dateKeySegment);
      const segmentHour = cursor.getHours();
      const nextHour = new Date(cursor);
      nextHour.setMinutes(0, 0, 0);
      nextHour.setHours(cursor.getHours() + 1);
      const segmentEnd = endDate < nextHour ? endDate : nextHour;
      const delta = segmentEnd.getTime() - cursor.getTime();

      if (hourlyDistributionSegment) {
        const hourEntrySegment = hourlyDistributionSegment.find(
          (entry) => entry.hour === segmentHour,
        );
        if (hourEntrySegment) {
          hourEntrySegment.time += delta;
        }
      }

      cursor = segmentEnd;
    }
  }

  const distributionResult: TimeDistribution = Array.from(
    distributionMap.entries(),
  ).map(([dateTimestampString, hourlyDist]) => {
    const resultDate = new Date(parseInt(dateTimestampString));

    return {
      date: resultDate,
      distribution: hourlyDist,
    };
  });

  distributionResult.sort((a, b) => a.date.getTime() - b.date.getTime());

  return distributionResult;
}
