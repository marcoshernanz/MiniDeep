import { SwipableRef } from "@/components/Swipable";
import calculateSessionDuration from "@/lib/time-tracking/calculateSessionDuration";
import getTimeDistribution from "@/lib/time-tracking/getTimeDistribution";
import getWorkSessions from "@/lib/time-tracking/getWorkSessions";
import { isSameDay, startOfDay } from "date-fns";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DeviceEventEmitter } from "react-native";

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

interface ActivityContextValue {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  activity: ActivityType[];
  isLoading: boolean;
  swipableRef: React.RefObject<SwipableRef>;
  scrollToDate: (date: Date) => void;
}

const ActivityContext = createContext<ActivityContextValue>({
  selectedDate: new Date(),
  setSelectedDate: () => {},
  activity: [],
  isLoading: false,
  swipableRef: { current: null },
  scrollToDate: () => {},
});

interface Props {
  children: React.ReactNode;
}

export default function ActivityContextProvider({ children }: Props) {
  const [activity, setActivity] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const swipableRef = useRef<SwipableRef>(null);

  const scrollToDate = useCallback(
    (date: Date) => {
      const currentIndex = activity.findIndex((a) => isSameDay(a.date, date));
      if (swipableRef.current && currentIndex !== -1) {
        swipableRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
        });
      }
    },
    [activity],
  );

  const loadActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const sessionsData = await getWorkSessions();
      const timeDistributionData = await getTimeDistribution();

      const activityMap = new Map<string, ActivityType>();

      timeDistributionData.forEach((dist) => {
        const dateKey = startOfDay(dist.date).getTime().toString();
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
        const dateKey = startOfDay(session.startDate).getTime().toString();
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

      const processedActivity = Array.from(activityMap.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .toReversed();

      setActivity(processedActivity);
    } catch (error) {
      console.error("Error loading activity:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
    const subscription = DeviceEventEmitter.addListener(
      "sessionsChanged",
      loadActivity,
    );
    return () => {
      subscription.remove();
    };
  }, [loadActivity]);

  return (
    <ActivityContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        activity,
        isLoading,
        swipableRef,
        scrollToDate,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivityContext() {
  return useContext(ActivityContext);
}
