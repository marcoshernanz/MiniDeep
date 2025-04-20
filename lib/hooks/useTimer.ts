import { useState, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
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

  const sessionId = useRef("");
  const timeLeftRef = useRef(0);
  const accurateTimer = useRef<ReturnType<typeof createAccurateTimer> | null>(
    null,
  );

  const updateTimeRemaining = () => {
    if (timeLeftRef.current <= 0) {
      if (accurateTimer.current) {
        accurateTimer.current.stop();
      }

      setStatus({ isRunning: false, isPaused: false, isCompleted: true });
      addTimeEvent(sessionId.current, "stop");
      markSessionAsCompleted(sessionId.current);

      // TODO: Update app state

      setTimeLeft(0);
    }
  };

  const timerTick = () => {
    if (timeLeftRef.current > 0) {
      timeLeftRef.current -= 1000;
      setTimeLeft(timeLeftRef.current);
      updateTimeRemaining();
    }
  };

  const cleanupTimer = () => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;
    }
  };

  const startTimer = async (time: number) => {
    timeLeftRef.current = time;
    setTimeLeft(time);

    cleanupTimer();
    accurateTimer.current = createAccurateTimer(timerTick, 1000);

    setStatus({
      isRunning: true,
      isPaused: false,
      isCompleted: false,
    });

    const createdSessionId = await createNewSession(time);
    sessionId.current = createdSessionId;

    await addTimeEvent(createdSessionId, "start");

    await scheduleTimerCompletionNotification(time);

    accurateTimer.current.start();
  };

  const togglePause = async () => {
    if (!accurateTimer.current) return;

    if (status.isPaused) {
      accurateTimer.current.resume();
      await addTimeEvent(sessionId.current, "start");
      await scheduleTimerCompletionNotification(timeLeftRef.current);
    } else {
      accurateTimer.current.pause();
      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
    }

    setStatus((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const stopTimer = async () => {
    if (accurateTimer.current) {
      accurateTimer.current.stop();
      accurateTimer.current = null;

      await addTimeEvent(sessionId.current, "stop");
      await cancelTimerNotifications();
    }

    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });

    setTimeLeft(0);

    markSessionAsCompleted(sessionId.current);
  };

  const resetTimer = async () => {
    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });

    timeLeftRef.current = 0;
    sessionId.current = "";
    setTimeLeft(0);

    await cancelTimerNotifications();
  };

  // const saveCurrentTimerState = async () => {
  //   if (status.isRunning) {
  //     const state = status.isPaused ? "paused" : "running";
  //     await saveTimerState({
  //       state,
  //       remainingTime: timerRef.current.totalSeconds,
  //       initialDuration: timerRef.current.initialDuration,
  //       timestamp: Date.now(),
  //       sessionId: timerRef.current.sessionId,
  //     });

  //     // Keep notification scheduling consistent with timer state
  //     if (state === "running") {
  //       await scheduleTimerCompletionNotification(
  //         timerRef.current.totalSeconds,
  //       );
  //     } else {
  //       await cancelTimerNotifications();
  //     }
  //   }
  // };

  // const restoreTimerState = async () => {
  //   cleanupTimer();

  //   const savedState = await getTimerState();

  //   if (!savedState || savedState.state === "inactive") return;

  //   timerRef.current.sessionId = savedState.sessionId;
  //   timerRef.current.initialDuration = savedState.initialDuration;

  //   let remainingTime = savedState.remainingTime;

  //   if (savedState.state === "running") {
  //     const elapsedSeconds = Math.floor(
  //       (Date.now() - savedState.timestamp) / 1000,
  //     );
  //     remainingTime = Math.max(0, remainingTime - elapsedSeconds);
  //   }

  //   if (remainingTime <= 0 && savedState.state !== "completed") {
  //     setStatus({ isRunning: false, isPaused: false, isCompleted: true });
  //     await addTimeEvent(savedState.sessionId, "complete", 0);
  //     return;
  //   }

  //   timerRef.current.totalSeconds = remainingTime;

  //   const hours = Math.floor(remainingTime / 3600);
  //   const minutes = Math.floor((remainingTime % 3600) / 60);
  //   const seconds = remainingTime % 60;

  //   setDisplayTime({ hours, minutes, seconds });

  //   setStatus({
  //     isRunning:
  //       savedState.state === "running" || savedState.state === "paused",
  //     isPaused: savedState.state === "paused",
  //     isCompleted: savedState.state === "completed",
  //   });

  //   if (savedState.state === "running") {
  //     timerRef.current.accurateTimer = createAccurateTimer(timerTick, 1000);
  //     timerRef.current.accurateTimer.start();
  //   }
  // };

  // const handleAppStateChange = async (nextAppState: string) => {
  //   if (nextAppState === "active") {
  //     await restoreTimerState();
  //   } else if (nextAppState === "background" || nextAppState === "inactive") {
  //     await saveCurrentTimerState();
  //   }
  // };

  const handleNotificationResponse = async (
    response: Notifications.NotificationResponse,
  ) => {
    const actionIdentifier = response.actionIdentifier;

    if (actionIdentifier === DISMISS_ACTION_ID) {
      await Notifications.dismissNotificationAsync(
        response.notification.request.identifier,
      );
      await resetTimer();
    }
  };

  // useEffect(() => {
  //   setupNotifications();
  //   restoreTimerState();

  //   const subscription = AppState.addEventListener(
  //     "change",
  //     handleAppStateChange,
  //   );

  //   // Set up notification response handler with the separate function
  //   const notificationResponseSubscription =
  //     Notifications.addNotificationResponseReceivedListener(
  //       handleNotificationResponse,
  //     );

  //   return () => {
  //     cleanupTimer();
  //     subscription.remove();
  //     notificationResponseSubscription.remove();
  //   };
  // }, []);

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
