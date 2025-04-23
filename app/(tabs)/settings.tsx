import { View, Text, Switch, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRightIcon, MoonIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import seedDummyData from "@/lib/time-tracking/seedDummyData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import timeTrackingConfig from "@/config/timeTrackingConfig";
import { useState } from "react";

export default function SettingsScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedDummyData();
      Alert.alert("Success", "Dummy data seeded!");
    } catch (e) {
      Alert.alert("Error", "Failed to seed dummy data.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(timeTrackingConfig.storageKey);
      Alert.alert("Success", "All data cleared!");
    } catch (e) {
      Alert.alert("Error", "Failed to clear data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="mt-2 text-muted-foreground">
            Configure your app preferences
          </Text>
        </View>

        <View className="border-b border-t border-border bg-card py-2">
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              {isDarkColorScheme ? (
                <MoonIcon color="rgb(2, 8, 23)" size={20} />
              ) : (
                <SunIcon color="rgb(248, 250, 252)" size={20} />
              )}
              <Text className="ml-3 font-medium text-foreground">
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkColorScheme}
              // onValueChange={(value) => setTheme(value ? "dark" : "light")}
              trackColor={{
                false: "rgb(226, 232, 240)",
                true: "rgb(234, 88, 12)",
              }}
              thumbColor="rgb(255, 255, 255)"
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="px-4 pb-2 text-sm font-medium text-muted-foreground">
            Account
          </Text>
          <View className="border-b border-t border-border bg-card">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Profile Information</Text>
              <ChevronRightIcon
                color={
                  isDarkColorScheme
                    ? "rgb(148, 163, 184)"
                    : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Notification Settings</Text>
              <ChevronRightIcon
                color={
                  isDarkColorScheme
                    ? "rgb(148, 163, 184)"
                    : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Privacy & Security</Text>
              <ChevronRightIcon
                color={
                  isDarkColorScheme
                    ? "rgb(148, 163, 184)"
                    : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
          </View>
        </View>

        <View className="mt-6">
          <Text className="px-4 pb-2 text-sm font-medium text-muted-foreground">
            Preferences
          </Text>
          <View className="border-b border-t border-border bg-card">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Language</Text>
              <View className="flex-row items-center">
                <Text className="mr-2 text-muted-foreground">English</Text>
                <ChevronRightIcon
                  color={
                    isDarkColorScheme
                      ? "rgb(148, 163, 184)"
                      : "rgb(100, 116, 139)"
                  }
                  size={20}
                />
              </View>
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Units</Text>
              <View className="flex-row items-center">
                <Text className="mr-2 text-muted-foreground">Metric</Text>
                <ChevronRightIcon
                  color={
                    isDarkColorScheme
                      ? "rgb(148, 163, 184)"
                      : "rgb(100, 116, 139)"
                  }
                  size={20}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View className="mb-8 mt-6">
          <Text className="px-4 pb-2 text-sm font-medium text-muted-foreground">
            About
          </Text>
          <View className="border-b border-t border-border bg-card">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">App Version</Text>
              <Text className="text-muted-foreground">1.0.0</Text>
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable
              className="flex-row items-center justify-between px-4 py-3"
              onPress={handleSeedData}
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text className="text-foreground">Seed Dummy Data</Text>
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable
              className="flex-row items-center justify-between px-4 py-3"
              onPress={handleClearData}
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text className="text-foreground">Clear All Data</Text>
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Terms & Conditions</Text>
              <ChevronRightIcon
                color={
                  isDarkColorScheme
                    ? "rgb(148, 163, 184)"
                    : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="mx-4 h-px bg-border" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Privacy Policy</Text>
              <ChevronRightIcon
                color={
                  isDarkColorScheme
                    ? "rgb(148, 163, 184)"
                    : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
