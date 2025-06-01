import Constants from "expo-constants";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT as
  | string
  | undefined;
const isDevelopment = appVariant === "development";
const isPreview = appVariant === "preview";

const baseKey = "minideep_tracker_state";
const storageKey = isDevelopment
  ? `${baseKey}_dev`
  : isPreview
    ? `${baseKey}_preview`
    : baseKey;

export const trackerStateConfig = { storageKey };
