import { startOfWeek, isSameWeek } from "date-fns";

export default function groupDaysIntoWeeks(days: Date[]): (Date | null)[][] {
  if (!days.length) return [[null, null, null, null, null, null, null]];

  const sortedDays = [...days].sort((a, b) => a.getTime() - b.getTime());
  const weeks: (Date | null)[][] = [];

  let currentWeek: (Date | null)[] = [];
  let currentWeekStart: Date = startOfWeek(sortedDays[0], {
    weekStartsOn: 1,
  });

  const firstDayOfWeek =
    sortedDays[0].getDay() === 0 ? 6 : sortedDays[0].getDay() - 1;

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  sortedDays.forEach((day) => {
    if (!isSameWeek(day, currentWeekStart, { weekStartsOn: 1 })) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }

      weeks.push(currentWeek);
      currentWeekStart = startOfWeek(day, { weekStartsOn: 1 });
      currentWeek = Array(day.getDay() === 0 ? 6 : day.getDay() - 1).fill(null);
    }

    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}
