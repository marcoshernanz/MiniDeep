import { useAppContext } from "@/context/AppContext";
import * as Notifications from "expo-notifications";
import { useMemo, useState, useEffect, useCallback } from "react";
import calculateSessionDuration from "../sessions/calculateSessionDuration";
import uuid from "../utils/uuidv4";

const TIMER_CATEGORY = "MiniLift_timer_completed";
const TIMER_CHANNEL_ID = "MiniLift_timer_completed_channel";
const FINISH_ACTION_ID = "MiniLift_finish";

const setupNotifications = async () => {
  await Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      priority: Notifications.AndroidNotificationPriority.HIGH,
      shouldShowBanner: true,
      shouldShowList: false,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  await Notifications.setNotificationCategoryAsync(TIMER_CATEGORY, [
    {
      identifier: FINISH_ACTION_ID,
      buttonTitle: "Finish",
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await Notifications.setNotificationChannelAsync(TIMER_CHANNEL_ID, {
    name: "Timer Notifications",
    sound: "timer_done.wav",
    importance: Notifications.AndroidImportance.MAX,
    bypassDnd: true,
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });
};

const scheduleNotification = async (time: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Timer Complete",
      sound: "timer_done.wav",
      sticky: true,
      autoDismiss: false,
      priority: Notifications.AndroidNotificationPriority.MAX,
      interruptionLevel: "critical",
      categoryIdentifier: TIMER_CATEGORY,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(Date.now() + time),
      channelId: TIMER_CHANNEL_ID,
    },
  });
};

const cancelNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export default function useTimer() {
  const { appData, setAppData } = useAppContext();

  const [now, setNow] = useState(Date.now());

  const { status, timeLeft } = useMemo(() => {
    const timerSessions = appData.sessions.filter((s) => s.type === "timer");
    if (timerSessions.length === 0) {
      return { status: "finished", timeLeft: 0 };
    }

    const latestTimer = timerSessions[timerSessions.length - 1];
    const status = latestTimer.status;
    const timeLeft =
      latestTimer.inputDuration - calculateSessionDuration(latestTimer, now);
    return { status, timeLeft };
  }, [appData.sessions, now]);

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => setNow(Date.now()), 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  const togglePause = useCallback(async () => {
    const sessions = appData.sessions;
    if (sessions.length === 0) return;

    const session = appData.sessions[appData.sessions.length - 1];
    if (session.type !== "timer") return;

    const nowDate = new Date();

    if (session.status === "running") {
      const updatedEvents = session.events.map((e, i) =>
        i === session.events.length - 1 ? { ...e, stop: nowDate } : e
      );
      setAppData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s, i) =>
          i === sessions.length - 1
            ? { ...session, status: "paused", events: updatedEvents }
            : s
        ),
      }));

      setNow(nowDate.getTime());
      await cancelNotifications();
    } else if (session.status === "paused") {
      const newEvent = { start: nowDate, stop: null };
      const remaining =
        session.inputDuration -
        calculateSessionDuration(session, nowDate.getTime());
      setAppData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s, i) =>
          i === sessions.length - 1
            ? {
                ...session,
                status: "running",
                events: [...session.events, newEvent],
              }
            : s
        ),
      }));

      setNow(nowDate.getTime());
      await setupNotifications();
      await scheduleNotification(remaining);
    }
  }, [appData.sessions, setAppData]);

  const stop = useCallback(async () => {
    const sessions = appData.sessions;
    if (sessions.length === 0) return;

    const session = sessions[sessions.length - 1];
    if (session.type !== "timer") return;

    const nowDate = new Date();
    let updatedEvents = session.events;
    if (session.status === "running") {
      updatedEvents = session.events.map((e, i) =>
        i === session.events.length - 1 ? { ...e, stop: nowDate } : e
      );
    }

    setAppData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s, i) =>
        i === sessions.length - 1
          ? { ...session, status: "finished", events: updatedEvents }
          : s
      ),
    }));
    setNow(nowDate.getTime());
    await cancelNotifications();
    await Notifications.dismissAllNotificationsAsync();
  }, [appData.sessions, setAppData]);

  const start = useCallback(
    async (inputDuration: number) => {
      if (status !== "finished") return;

      await setupNotifications();

      const nowDate = new Date();
      const newSession = {
        id: uuid(),
        createdAt: nowDate,
        type: "timer" as const,
        status: "running" as const,
        inputDuration,
        events: [{ start: nowDate, stop: null }],
      };

      setAppData((prev) => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
      }));
      setNow(nowDate.getTime());

      await scheduleNotification(inputDuration);
    },
    [status, setAppData]
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response.actionIdentifier === FINISH_ACTION_ID) {
          await Notifications.dismissAllNotificationsAsync();
          await stop();
        }
      }
    );

    return () => subscription.remove();
  }, [stop]);

  return { status, timeLeft, togglePause, stop, start };
}
