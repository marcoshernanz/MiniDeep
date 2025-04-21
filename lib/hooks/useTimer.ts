import { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import createAccurateTimer from "../utils/createAccurateTimer";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTimerState from "../timer/getTimerState";
import saveTimerState from "../timer/saveTimerState";
import * as Notifications from "expo-notifications";
import markSessionAsCompleted from "../time-tracking/markSessionAsCompleted";

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

  const [status, setStatus] = useState({
    isRunning: false,
    isPaused: false,
    isCompleted: false,
  });

  const statusRef = useRef(status);
  const sessionId = useRef("");
  const timeLeftRef = useRef(0);
  const accurateTimer = useRef<ReturnType<typeof createAccurateTimer> | null>(
    null,
  );

  const cleanupTimer = useCallback(() => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    if (timeLeftRef.current <= 0) {
      if (accurateTimer.current) {
        accurateTimer.current.stop();
      }

      setStatus({ isRunning: false, isPaused: false, isCompleted: true });
      addTimeEvent(sessionId.current, "stop");
      markSessionAsCompleted(sessionId.current);

      saveTimerState({
        state: "completed",
        remainingTime: 0,
        date: new Date(),
        sessionId: sessionId.current,
      });

      setTimeLeft(0);
    }
  }, []);

  const timerTick = useCallback(() => {
    if (timeLeftRef.current > 0) {
      timeLeftRef.current -= 1000;
      setTimeLeft(timeLeftRef.current);
      updateTimeRemaining();
    }
  }, [updateTimeRemaining]);

  const startTimer = async (time: number) => {
    timeLeftRef.current = time;
    setTimeLeft(time);

    cleanupTimer();
    accurateTimer.current = createAccurateTimer(timerTick, 1000);

    setStatus({ isRunning: true, isPaused: false, isCompleted: false });

    const createdSessionId = await createNewSession(time);
    sessionId.current = createdSessionId;

    await addTimeEvent(createdSessionId, "start");

    await scheduleTimerCompletionNotification(time);

    await saveTimerState({
      state: "running",
      remainingTime: timeLeftRef.current,
      date: new Date(),
      sessionId: sessionId.current,
    });

    accurateTimer.current.start();
  };

  const togglePause = async () => {
    if (!accurateTimer.current) return;

    if (status.isPaused) {
      accurateTimer.current.resume();
      await addTimeEvent(sessionId.current, "start");
      await scheduleTimerCompletionNotification(timeLeftRef.current);
      await saveTimerState({
        state: "running",
        remainingTime: timeLeftRef.current,
        date: new Date(),
        sessionId: sessionId.current,
      });
    } else {
      accurateTimer.current.pause();
      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
      await saveTimerState({
        state: "paused",
        remainingTime: timeLeftRef.current,
        date: new Date(),
        sessionId: sessionId.current,
      });
    }

    setStatus((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const stopTimer = async () => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;

      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
    }

    setStatus({ isRunning: false, isPaused: false, isCompleted: false });

    setTimeLeft(0);

    await saveTimerState({
      state: "inactive",
      remainingTime: 0,
      date: new Date(),
      sessionId: "",
    });

    markSessionAsCompleted(sessionId.current);
  };

  const resetTimer = useCallback(async () => {
    setStatus({ isRunning: false, isPaused: false, isCompleted: false });

    timeLeftRef.current = 0;
    sessionId.current = "";
    setTimeLeft(0);

    await cancelTimerNotifications();

    await saveTimerState({
      state: "inactive",
      remainingTime: 0,
      date: new Date(),
      sessionId: "",
    });
  }, []);

  const saveCurrentTimerState = useCallback(async () => {
    if (statusRef.current.isRunning && !statusRef.current.isPaused) {
      await saveTimerState({
        state: "running",
        remainingTime: timeLeftRef.current,
        date: new Date(),
        sessionId: sessionId.current,
      });

      await scheduleTimerCompletionNotification(timeLeftRef.current);
    } else {
      await cancelTimerNotifications();
    }
  }, []);

  const restoreTimerState = useCallback(async () => {
    cleanupTimer();

    const savedState = await getTimerState();

    if (!savedState || savedState.state === "inactive") return;

    sessionId.current = savedState.sessionId;

    let remainingTime = savedState.remainingTime;
    if (savedState.state === "running") {
      const elapsedTime = Math.floor(Date.now() - savedState.date.getTime());
      remainingTime = Math.max(0, remainingTime - elapsedTime);
    }

    if (remainingTime <= 0 && savedState.state !== "completed") {
      setStatus({ isRunning: false, isPaused: false, isCompleted: true });
      await addTimeEvent(savedState.sessionId, "stop");
      return;
    }

    timeLeftRef.current = remainingTime;
    setTimeLeft(remainingTime);

    setStatus({
      isRunning:
        savedState.state === "running" || savedState.state === "paused",
      isPaused: savedState.state === "paused",
      isCompleted: savedState.state === "completed",
    });

    if (savedState.state === "running") {
      accurateTimer.current = createAccurateTimer(timerTick, 1000);
      accurateTimer.current.start();
    } else if (savedState.state === "paused") {
      accurateTimer.current = createAccurateTimer(timerTick, 1000);
      accurateTimer.current.start();
      accurateTimer.current.pause();
    }
  }, [cleanupTimer, timerTick]);

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
    timeLeft: timeLeft,
    isRunning: status.isRunning,
    isPaused: status.isPaused,
    isCompleted: status.isCompleted,
    startTimer,
    togglePause,
    stopTimer,
    resetTimer,
  };
}
