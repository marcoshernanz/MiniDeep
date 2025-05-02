const isDevelopment = process.env.APP_VARIANT === "development";
const isPreview = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (isDevelopment) {
    return "com.marcoshernanz.minideep.dev";
  } else if (isPreview) {
    return "com.marcoshernanz.minideep.preview";
  } else {
    return "com.marcoshernanz.minideep";
  }
};

const getAppName = () => {
  if (isDevelopment) {
    return "MiniDeep (Dev)";
  } else if (isPreview) {
    return "MiniDeep (Preview)";
  } else {
    return "MiniDeep";
  }
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
