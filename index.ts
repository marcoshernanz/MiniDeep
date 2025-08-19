import "react-native-get-random-values";

import "expo-router/entry";

import notifee from "@notifee/react-native";

notifee.registerForegroundService((notification) => {
  return new Promise(() => {});
});
