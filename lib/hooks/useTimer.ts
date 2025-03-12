import { useState, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import createAccurateTimer from "../utils/createAccurateTimer";
import addTimeEvent from "../time-tracking/addTimeEvent";
import createNewSession from "../time-tracking/createNewSession";
import getTimerState from "../timer/getTimerState";
import saveTimerState from "../timer/saveTimerState";
import * as Notifications from "expo-notifications";

const TIMER_CHANNEL_ID = "timer_completed_channel";

const checkNotificationChannel = async () => {
  if (Platform.OS === "android") {
    try {
      const channels = await Notifications.getNotificationChannelsAsync();
      const timerChannel = channels.find(
        (channel) => channel.id === TIMER_CHANNEL_ID,
      );
      console.log(timerChannel);
      return timerChannel;
    } catch (error) {
      console.error("Failed to check notification channel:", error);
      return null;
    }
  }
  return null;
};

const setupNotifications = async () => {
  await Notifications.requestPermissionsAsync();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(TIMER_CHANNEL_ID, {
      name: "Timer Notifications",
      sound: "timer_done.mp3",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
    });
  }

  await checkNotificationChannel();
};

const scheduleTimerCompletionNotification = async (seconds: number) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Timer Complete",
      body: "Your timer has finished!",
      sound: "timer_done.mp3",
      vibrate: [],
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

  const updateTimeRemaining = () => {
    const totalSecondsLeft = timerRef.current.totalSeconds;

    if (totalSecondsLeft <= 0) {
      if (timerRef.current.accurateTimer) {
        timerRef.current.accurateTimer.stop();
      }
      timerRef.current.totalSeconds = 0;
      setStatus((prev) => ({ ...prev, isCompleted: true }));

      Notifications.scheduleNotificationAsync({
        content: {
          title: "Timer Complete",
          body: "Your timer has finished!",
          sound: "timer_done.mp3",
          vibrate: [],
        },
        trigger: {
          channelId: TIMER_CHANNEL_ID,
        },
      });

      if (timerRef.current.sessionId) {
        addTimeEvent(
          timerRef.current.sessionId,
          "complete",
          timerRef.current.initialDuration,
        );
      }
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
      timestamp: Date.now(),
      sessionId: "",
    });

    await cancelTimerNotifications();
  };

  const saveCurrentTimerState = async () => {
    if (status.isRunning) {
      const state = status.isPaused ? "paused" : "running";
      await saveTimerState({
        state,
        remainingTime: timerRef.current.totalSeconds,
        initialDuration: timerRef.current.initialDuration,
        timestamp: Date.now(),
        sessionId: timerRef.current.sessionId,
      });

      if (state === "running") {
        await scheduleTimerCompletionNotification(
          timerRef.current.totalSeconds,
        );
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
          (Date.now() - savedState.timestamp) / 1000,
        );
        remainingTime = Math.max(0, remainingTime - elapsedSeconds);
      }

      if (remainingTime <= 0 && savedState.state !== "completed") {
        setStatus({ isRunning: false, isPaused: false, isCompleted: true });
        await addTimeEvent(savedState.sessionId, "complete", 0);
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

  useEffect(() => {
    setupNotifications();
    restoreTimerState();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      cleanupTimer();
      subscription.remove();
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
