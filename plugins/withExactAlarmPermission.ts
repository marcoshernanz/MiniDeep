import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";

const withExactAlarmPermission: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const usesPermissions = manifest.manifest["uses-permission"] || [];
    manifest.manifest["uses-permission"] = usesPermissions.filter(
      (perm) =>
        perm.$["android:name"] !== "android.permission.SCHEDULE_EXACT_ALARM"
    );

    manifest.manifest["uses-permission"].push({
      $: {
        "android:name": "android.permission.SCHEDULE_EXACT_ALARM",
        "android:maxSdkVersion": "32",
      },
    } as any);
    return config;
  });
};

export default withExactAlarmPermission;
