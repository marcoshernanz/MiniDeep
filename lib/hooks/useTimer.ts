import { useState, useEffect, useRef } from "react";
import { AppState, Vibration } from "react-native";
import createAccurateTimer from "../utils/createAccurateTimer";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTimerState from "../timer/getTimerState";
import saveTimerState from "../timer/saveTimerState";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";

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

  // Set up the notification category with dismiss action
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

const scheduleTimerCompletionNotification = async (seconds: number) => {
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
      seconds,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: TIMER_CHANNEL_ID,
    },
  });
};

const cancelTimerNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export default function useTimer() {
  const [displayTime, setDisplayTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [status, setStatus] = useState({
    isRunning: false,
    isPaused: false,
    isCompleted: false,
  });

  const timerRef = useRef({
    totalSeconds: 0,
    accurateTimer: null as ReturnType<typeof createAccurateTimer> | null,
    sessionId: "",
    initialDuration: 0,
  });

  // Create a ref to track vibration state
  const vibrationRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start continuous vibration pattern
  const startContinuousVibration = () => {
    // Clear any existing vibration first
    Vibration.cancel();

    // Pattern for strong, continuous vibration:
    // vibrate for 1000ms, pause for 500ms, repeat indefinitely
    const pattern = [0, 1000, 500];

    // Start vibration with repeat (passing -1 means infinite repeat)
    Vibration.vibrate(pattern, true);

    // Also use Haptics for immediate feedback on supported devices
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      .then(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      })
      .catch((error) =>
        console.error("Failed to trigger haptic feedback:", error),
      );

    // Set up a repeating heavy impact every 2 seconds for additional strength
    vibrationRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch((error) =>
        console.error("Failed to trigger impact feedback:", error),
      );
    }, 2000);
  };

  // Function to stop vibration
  const stopVibration = () => {
    Vibration.cancel();
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current);
      vibrationRef.current = null;
    }
  };

  const updateTimeRemaining = () => {
    const totalSecondsLeft = timerRef.current.totalSeconds;

    if (totalSecondsLeft <= 0) {
      if (timerRef.current.accurateTimer) {
        timerRef.current.accurateTimer.stop();
      }
      timerRef.current.totalSeconds = 0;
      setStatus((prev) => ({ ...prev, isCompleted: true }));

      if (timerRef.current.sessionId) {
        addTimeEvent(
          timerRef.current.sessionId,
          "complete",
          timerRef.current.initialDuration,
        );
      }

      // Start continuous vibration when timer completes
      startContinuousVibration();
    }

    const hours = Math.floor(totalSecondsLeft / 3600);
    const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
    const seconds = totalSecondsLeft % 60;

    setDisplayTime({
      hours,
      minutes,
      seconds,
    });
  };

  const timerTick = () => {
    if (timerRef.current.totalSeconds > 0) {
      timerRef.current.totalSeconds -= 1;
      updateTimeRemaining();
    }
  };

  // Cleanup any existing timer
  const cleanupTimer = () => {
    if (timerRef.current.accurateTimer) {
      timerRef.current.accurateTimer.stop();
      timerRef.current.accurateTimer = null;
    }
  };

  const startTimer = async ({
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  }) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timerRef.current.totalSeconds = totalSeconds;
    timerRef.current.initialDuration = totalSeconds;

    cleanupTimer();
    timerRef.current.accurateTimer = createAccurateTimer(timerTick, 1000);

    setDisplayTime({
      hours,
      minutes,
      seconds,
    });

    setStatus({
      isRunning: true,
      isPaused: false,
      isCompleted: false,
    });

    const sessionId = await createNewSession(totalSeconds);
    timerRef.current.sessionId = sessionId;

    await addTimeEvent(sessionId, "start", totalSeconds);

    // Schedule notification when timer starts
    await scheduleTimerCompletionNotification(totalSeconds);

    timerRef.current.accurateTimer.start();
  };

  const togglePause = async () => {
    if (!timerRef.current.accurateTimer) return;

    const remainingTime = timerRef.current.totalSeconds;

    if (status.isPaused) {
      timerRef.current.accurateTimer.resume();
      await addTimeEvent(timerRef.current.sessionId, "resume", remainingTime);
      await scheduleTimerCompletionNotification(remainingTime);
      console.log(remainingTime);
    } else {
      timerRef.current.accurateTimer.pause();
      await addTimeEvent(timerRef.current.sessionId, "pause", remainingTime);
      await cancelTimerNotifications();
    }

    setStatus((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const stopTimer = async () => {
    if (timerRef.current.accurateTimer) {
      timerRef.current.accurateTimer.stop();
      timerRef.current.accurateTimer = null;

      const remainingTime = timerRef.current.totalSeconds;
      const elapsedTime = timerRef.current.initialDuration - remainingTime;
      await addTimeEvent(timerRef.current.sessionId, "stop", elapsedTime);
      await cancelTimerNotifications();

      // Stop vibration if any is ongoing
      stopVibration();
    }

    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });

    setDisplayTime({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  const resetTimer = async () => {
    setStatus({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    });

    setDisplayTime({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    timerRef.current.totalSeconds = 0;
    timerRef.current.sessionId = "";

    await saveTimerState({
      state: "inactive",
      remainingTime: 0,
      initialDuration: 0,
      date: new Date(),
      sessionId: "",
    });

    await cancelTimerNotifications();

    // Stop vibration when timer is reset
    stopVibration();
  };

  const saveCurrentTimerState = async () => {
    if (status.isRunning) {
      const state = status.isPaused ? "paused" : "running";
      await saveTimerState({
        state,
        remainingTime: timerRef.current.totalSeconds,
        initialDuration: timerRef.current.initialDuration,
        date: new Date(),
        sessionId: timerRef.current.sessionId,
      });

      // Keep notification scheduling consistent with timer state
      if (state === "running") {
        await scheduleTimerCompletionNotification(
          timerRef.current.totalSeconds,
        );
      } else {
        await cancelTimerNotifications();
      }
    }
  };

  const restoreTimerState = async () => {
    try {
      cleanupTimer();

      const savedState = await getTimerState();

      if (!savedState || savedState.state === "inactive") return;

      timerRef.current.sessionId = savedState.sessionId;
      timerRef.current.initialDuration = savedState.initialDuration;

      let remainingTime = savedState.remainingTime;

      if (savedState.state === "running") {
        const elapsedSeconds = Math.floor(
          (Date.now() - savedState.date.getTime()) / 1000,
        );
        remainingTime = Math.max(0, remainingTime - elapsedSeconds);
      }

      if (remainingTime <= 0 && savedState.state !== "completed") {
        setStatus({ isRunning: false, isPaused: false, isCompleted: true });
        await addTimeEvent(savedState.sessionId, "complete", 0);

        // Start continuous vibration if timer completed while app was in background
        startContinuousVibration();
        return;
      }

      timerRef.current.totalSeconds = remainingTime;

      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = remainingTime % 60;

      setDisplayTime({ hours, minutes, seconds });

      setStatus({
        isRunning:
          savedState.state === "running" || savedState.state === "paused",
        isPaused: savedState.state === "paused",
        isCompleted: savedState.state === "completed",
      });

      if (savedState.state === "running") {
        timerRef.current.accurateTimer = createAccurateTimer(timerTick, 1000);
        timerRef.current.accurateTimer.start();
      }
    } catch (error) {
      console.error("Error restoring timer state:", error);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === "active") {
      await restoreTimerState();
    } else if (nextAppState === "background" || nextAppState === "inactive") {
      await saveCurrentTimerState();
    }
  };

  const handleNotificationResponse = async (
    response: Notifications.NotificationResponse,
  ) => {
    const actionIdentifier = response.actionIdentifier;

    if (actionIdentifier === DISMISS_ACTION_ID) {
      await Notifications.dismissNotificationAsync(
        response.notification.request.identifier,
      );

      // Stop vibration when notification is dismissed
      stopVibration();
      await resetTimer();
    }
  };

  useEffect(() => {
    setupNotifications();
    restoreTimerState();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    // Set up notification response handler with the separate function
    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    return () => {
      cleanupTimer();
      stopVibration(); // Ensure vibration stops when component unmounts
      subscription.remove();
      notificationResponseSubscription.remove();
    };
  }, []);

  return {
    hours: displayTime.hours,
    minutes: displayTime.minutes,
    seconds: displayTime.seconds,
    isRunning: status.isRunning,
    isPaused: status.isPaused,
    isCompleted: status.isCompleted,
    startTimer,
    togglePause,
    stopTimer,
    resetTimer,
  };
}
