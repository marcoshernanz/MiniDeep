import getWorkSessions from "../time-tracking/getWorkSessions";
import { TimeEvent } from "@/config/timeTrackingConfig"; // Correctly import TimeEvent

type DailyStatistics = {
  date: string;
  time: number; // Time in seconds
}[];

export default async function getDailyStatistics(): Promise<DailyStatistics> {
  const workSessions = await getWorkSessions();
  // Assuming WorkSessionEvent has { date: number | string | Date, duration: number }
  // Flatten all events from all sessions
  const events: TimeEvent[] = workSessions
    .map((session) => session.events)
    .flat();

  const dailyTimeMap = new Map<string, number>(); // Map to store total time in milliseconds per day

  if (events.length === 0) {
    return []; // Return empty array if no events
  }

  // Iterate through each event to aggregate time by day
  for (const event of events) {
    // Assuming event.duration exists and is in milliseconds.
    // Skip if duration is missing or not positive.
    if (typeof event.duration !== "number" || event.duration <= 0) {
      continue;
    }

    try {
      // Get the date string in YYYY-MM-DD format
      const dateString = new Date(event.date).toISOString().split("T")[0];
      // Get the current accumulated time for this date, default to 0
      const currentDuration = dailyTimeMap.get(dateString) || 0;
      // Add the event's duration to the map
      dailyTimeMap.set(dateString, currentDuration + event.duration);
    } catch (e) {
      // Log error if date is invalid, and skip this event
      console.error("Error processing event date:", event.date, e);
      continue;
    }
  }

  // Convert the map into the desired array format
  const dailyStatistics: DailyStatistics = Array.from(dailyTimeMap.entries())
    .map(([date, timeMs]) => ({
      date,
      time: Math.round(timeMs / 1000), // Convert milliseconds to seconds
    }))
    .sort((a, b) => a.date.localeCompare(b.date)); // Sort chronologically

  return dailyStatistics;
}
