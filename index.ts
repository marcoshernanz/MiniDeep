import "react-native-get-random-values";

import "expo-router/entry";

import notifee, { Event, EventType } from "@notifee/react-native";
import { getStopwatchControls } from "./lib/controls/stopwatchControls";

async function handleNotifeeEvents(event: Event) {
  if (event.type === EventType.ACTION_PRESS) {
    const pressActionId = event.detail.pressAction?.id;
    if (pressActionId === "pause") {
      getStopwatchControls()?.togglePause();
    } else if (pressActionId === "resume") {
      getStopwatchControls()?.togglePause();
    } else if (pressActionId === "stop") {
      getStopwatchControls()?.stop();
    }
  }
}

notifee.registerForegroundService((notification) => {
  return new Promise(() => {});
});

notifee.onForegroundEvent(handleNotifeeEvents);
notifee.onBackgroundEvent(handleNotifeeEvents);
