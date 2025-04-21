import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import createAccurateTimer from "../utils/createAccurateTimer";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTimerState from "../timer/getTimerState";
import saveTimerState from "../timer/saveTimerState";
import * as Notifications from "expo-notifications";
import markSessionAsCompleted from "../time-tracking/markSessionAsCompleted";
import { TimerStatus } from "@/config/timerStateConfig";

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
      seconds: Math.floor(time / 1000),
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
  const [status, setStatus] = useState<TimerStatus>("inactive");

  const statusRef = useRef<TimerStatus>(status);
  const sessionId = useRef("");
  const timeLeftRef = useRef(0);
  const accurateTimer = useRef<ReturnType<typeof createAccurateTimer> | null>(
    null,
  );

  const cleanupTimer = useCallback(() => {
    console.log("Cleaning up timer");
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;
    }
  }, []);

  const handleTimerCompletion = useCallback(() => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
    }

    setStatus("completed");
    addTimeEvent(sessionId.current, "stop");
    markSessionAsCompleted(sessionId.current);

    timeLeftRef.current = 0;
    setTimeLeft(0);
  }, []);

  const timerTick = useCallback(() => {
    if (timeLeftRef.current > 0) {
      timeLeftRef.current -= 1000;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        handleTimerCompletion();
      }
    }
  }, [handleTimerCompletion]);

  const startTimer = async (time: number) => {
    timeLeftRef.current = time;
    setTimeLeft(time);

    cleanupTimer();
    accurateTimer.current = createAccurateTimer(timerTick, 1000);

    setStatus("running");

    const createdSessionId = await createNewSession(time);
    sessionId.current = createdSessionId;

    await addTimeEvent(createdSessionId, "start");

    await scheduleTimerCompletionNotification(time);

    accurateTimer.current.start();
  };

  const togglePause = async () => {
    if (!accurateTimer.current) return;

    if (status === "paused") {
      accurateTimer.current.resume();
      await addTimeEvent(sessionId.current, "start");
      await scheduleTimerCompletionNotification(timeLeftRef.current);
      setStatus("running");
    } else if (status === "running") {
      accurateTimer.current.pause();
      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
      setStatus("paused");
    }
  };

  const stopTimer = async () => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;

      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
    }

    setStatus("inactive");

    setTimeLeft(0);

    markSessionAsCompleted(sessionId.current);
  };

  const resetTimer = useCallback(async () => {
    setStatus("inactive");
    timeLeftRef.current = 0;
    sessionId.current = "";
    setTimeLeft(0);

    await cancelTimerNotifications();
  }, []);

  const saveCurrentTimerState = useCallback(async () => {
    saveTimerState({
      status: statusRef.current,
      remainingTime: timeLeftRef.current,
      date: new Date(),
      sessionId: sessionId.current,
    });
  }, []);

  const restoreTimerState = useCallback(async () => {
    cleanupTimer();

    const savedState = await getTimerState();

    console.log("AAA", savedState);

    if (!savedState || savedState.status === "inactive") return;

    setStatus(savedState.status);
    timeLeftRef.current = savedState.remainingTime;
    setTimeLeft(savedState.remainingTime);
    sessionId.current = savedState.sessionId;

    if (savedState.status === "running") {
      const elapsedTime = Math.floor(Date.now() - savedState.date.getTime());
      timeLeftRef.current = Math.max(0, timeLeftRef.current - elapsedTime);

      if (timeLeftRef.current <= 0) {
        handleTimerCompletion();
        return;
      }

      accurateTimer.current = createAccurateTimer(timerTick, 1000);
      accurateTimer.current.start();
    } else if (savedState.status === "paused") {
      console.log("Restoring paused timer state");
      accurateTimer.current = createAccurateTimer(timerTick, 1000);
      accurateTimer.current.start();
      accurateTimer.current.pause();
    }
  }, [cleanupTimer, handleTimerCompletion, timerTick]);

  const handleAppStateChange = useCallback(
    async (nextAppState: string) => {
      if (nextAppState === "active") {
        await restoreTimerState();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
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
        await resetTimer();
      }
    },
    [resetTimer],
  );

  useEffect(() => {
    setupNotifications();
    restoreTimerState();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    return () => {
      cleanupTimer();
      subscription.remove();
      notificationResponseSubscription.remove();
    };
  }, [
    cleanupTimer,
    handleAppStateChange,
    handleNotificationResponse,
    restoreTimerState,
  ]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  return {
    timeLeft,
    status,
    startTimer,
    togglePause,
    stopTimer,
    resetTimer,
  };
}
