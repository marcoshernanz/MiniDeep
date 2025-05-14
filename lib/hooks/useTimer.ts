import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTimerState from "../tracker/getTimerState";
import saveTimerState from "../tracker/saveTimerState";
import * as Notifications from "expo-notifications";
import markSessionAsCompleted from "../time-tracking/markSessionAsCompleted";
import { TimerState } from "@/zod/schemas/TimerStateSchema";
import createAccurateTimer from "../utils/createAccurateTimer";

const TIMER_CHANNEL_ID = "timer_completed_channel";
const TIMER_CATEGORY = "timer_completed";
const DISMISS_ACTION_ID = "dismiss";

const setupNotifications = async () => {
  await Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  await Notifications.setNotificationCategoryAsync(TIMER_CATEGORY, [
    {
      identifier: DISMISS_ACTION_ID,
      buttonTitle: "Dismiss",
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
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

const scheduleTimerCompletionNotification = async (time: number) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Timer Complete",
      body: "Your timer has finished!",
      sound: "timer_done.wav",
      sticky: true,
      autoDismiss: false,
      priority: Notifications.AndroidNotificationPriority.MAX,
      interruptionLevel: "critical",
      categoryIdentifier: TIMER_CATEGORY,
    },
    trigger: {
      ...(time > 0 ? { seconds: Math.floor(time / 1000) } : {}),
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: TIMER_CHANNEL_ID,
    },
  });
};

const cancelTimerNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export default function useTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<TimerState["status"]>("inactive");

  const timerRef = useRef({
    accurateTimer: null as ReturnType<typeof createAccurateTimer> | null,
    status: "inactive" as TimerState["status"],
    sessionId: "",
    startTime: 0,
    endTime: 0,
    tickTime: 0,
  });
  const isRestoringState = useRef(false);

  const handleTimerCompletion = useCallback(async (notify: boolean = true) => {
    timerRef.current.accurateTimer?.stop();
    timerRef.current.status = "completed";
    setStatus("completed");
    setTimeLeft(0);

    if (notify) {
      await scheduleTimerCompletionNotification(0);
    }

    await addTimeEvent({
      sessionId: timerRef.current.sessionId,
      action: "stop",
      time: timerRef.current.tickTime,
    });
    await markSessionAsCompleted(timerRef.current.sessionId);
  }, []);

  const timerTick = useCallback(() => {
    if (timerRef.current.status !== "running") return;

    const now = Date.now();
    const remaining = timerRef.current.endTime - now;
    timerRef.current.tickTime = now;
    setTimeLeft(remaining);

    if (remaining <= 0) {
      handleTimerCompletion();
    }
  }, [handleTimerCompletion]);

  if (!timerRef.current.accurateTimer) {
    timerRef.current.accurateTimer = createAccurateTimer(timerTick, 250);
  }

  const startTimer = async (duration: number) => {
    const now = Date.now();

    timerRef.current.startTime = now;
    timerRef.current.tickTime = now;
    timerRef.current.endTime = now + duration;

    timerRef.current.status = "running";
    setStatus("running");
    setTimeLeft(duration - 1);
    timerRef.current.accurateTimer?.start();

    const createdSessionId = await createNewSession({
      duration,
      startTime: now,
    });
    timerRef.current.sessionId = createdSessionId;

    await addTimeEvent({
      sessionId: timerRef.current.sessionId,
      action: "start",
      time: timerRef.current.tickTime,
    });
  };

  const togglePause = async () => {
    if (status === "paused") {
      const now = Date.now();
      const remaining = timerRef.current.endTime - timerRef.current.tickTime;

      timerRef.current.startTime = now;
      timerRef.current.endTime = now + remaining;
      timerRef.current.tickTime = now;

      timerRef.current.status = "running";
      setStatus("running");
      timerRef.current.accurateTimer?.resume();

      await addTimeEvent({
        sessionId: timerRef.current.sessionId,
        action: "start",
        time: timerRef.current.tickTime,
      });
    } else if (status === "running") {
      timerTick();

      timerRef.current.status = "paused";
      setStatus("paused");
      timerRef.current.accurateTimer?.pause();
      await addTimeEvent({
        sessionId: timerRef.current.sessionId,
        action: "stop",
        time: timerRef.current.tickTime,
      });
    }
  };

  const stopTimer = async () => {
    const wasCompleted = timerRef.current.status === "completed";

    timerRef.current.status = "inactive";
    setStatus("inactive");
    timerRef.current.accurateTimer?.stop();

    await cancelTimerNotifications();
    if (!wasCompleted) {
      await addTimeEvent({
        sessionId: timerRef.current.sessionId,
        action: "stop",
        time: timerRef.current.tickTime,
      });
      await markSessionAsCompleted(timerRef.current.sessionId);
    }
  };

  const saveCurrentTimerState = useCallback(async () => {
    if (isRestoringState.current) return;

    const remaining = timerRef.current.endTime - timerRef.current.tickTime;

    saveTimerState({
      status: timerRef.current.status,
      remainingTime: remaining,
      time: timerRef.current.tickTime,
      sessionId: timerRef.current.sessionId,
    });

    if (timerRef.current.status === "running") {
      await scheduleTimerCompletionNotification(remaining);
    }
  }, []);

  const restoreTimerState = useCallback(async () => {
    if (isRestoringState.current) return;
    isRestoringState.current = true;

    try {
      const savedState = await getTimerState();

      if (!savedState || savedState.status === "inactive") {
        timerRef.current.status = "inactive";
        setStatus("inactive");
        setTimeLeft(0);
        timerRef.current.accurateTimer?.stop();
        isRestoringState.current = false;
        return;
      }

      timerRef.current.status = savedState.status;
      timerRef.current.startTime = savedState.time;
      timerRef.current.endTime = savedState.time + savedState.remainingTime;
      timerRef.current.tickTime = savedState.time;
      timerRef.current.sessionId = savedState.sessionId;

      setStatus(savedState.status);
      setTimeLeft(savedState.remainingTime);

      if (savedState.status === "running") {
        const now = Date.now();
        const elapsed = now - savedState.time;
        const remaining = savedState.remainingTime - elapsed;

        if (remaining > 0) {
          timerRef.current.tickTime = now;
          timerRef.current.endTime = now + remaining;
          setTimeLeft(remaining);
          timerRef.current.accurateTimer?.resume();
        } else {
          timerRef.current.tickTime = timerRef.current.endTime;
          await handleTimerCompletion(false);
          isRestoringState.current = false;
          return;
        }
        await cancelTimerNotifications();
      } else if (savedState.status === "paused") {
        timerRef.current.accurateTimer?.pause();
      } else if (savedState.status === "completed") {
        setTimeLeft(0);
        timerRef.current.accurateTimer?.stop();
      }
    } finally {
      isRestoringState.current = false;
    }
  }, [handleTimerCompletion]);

  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      if (nextAppState === "active") {
        await restoreTimerState();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        if (timerRef.current.status === "running") {
          timerRef.current.accurateTimer?.pause();
        }
        await saveCurrentTimerState();
      }
    },
    [restoreTimerState, saveCurrentTimerState],
  );

  const handleNotificationResponse = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const actionIdentifier = response.actionIdentifier;

      if (actionIdentifier === DISMISS_ACTION_ID) {
        await Notifications.dismissNotificationAsync(
          response.notification.request.identifier,
        );
      }
    },
    [],
  );

  useEffect(() => {
    setupNotifications();
    restoreTimerState();

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    const accurateTimer = timerRef.current.accurateTimer;

    return () => {
      appStateSubscription.remove();
      notificationResponseSubscription.remove();
      accurateTimer?.stop();
    };
  }, [handleAppStateChange, handleNotificationResponse, restoreTimerState]);

  return {
    timeLeft,
    status,
    startTimer,
    togglePause,
    stopTimer,
  };
}
