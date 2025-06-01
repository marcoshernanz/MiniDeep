import Constants from "expo-constants";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT as
  | string
  | undefined;
const isDevelopment = appVariant === "development";
const isPreview = appVariant === "preview";

const baseKey = "minideep_work_sessions";
const storageKey = isDevelopment
  ? `${baseKey}_dev`
  : isPreview
    ? `${baseKey}_preview`
    : baseKey;

const timeTrackingConfig = { storageKey };

export default timeTrackingConfig;
