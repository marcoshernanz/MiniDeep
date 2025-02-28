import { View, Text, Switch, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/components/ThemeProvider";
import { ChevronRightIcon, MoonIcon, SunIcon } from "lucide-react-native";

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="py-6 px-4">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="mt-2 text-muted-foreground">
            Configure your app preferences
          </Text>
        </View>

        <View className="bg-card border-t border-b border-border py-2">
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              {theme === "dark" ? (
                <MoonIcon color="rgb(2, 8, 23)" size={20} />
              ) : (
                <SunIcon color="rgb(248, 250, 252)" size={20} />
              )}
              <Text className="ml-3 text-foreground font-medium">
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={(value) => setTheme(value ? "dark" : "light")}
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
          <View className="bg-card border-t border-b border-border">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Profile Information</Text>
              <ChevronRightIcon
                color={
                  theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="h-px bg-border mx-4" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Notification Settings</Text>
              <ChevronRightIcon
                color={
                  theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="h-px bg-border mx-4" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Privacy & Security</Text>
              <ChevronRightIcon
                color={
                  theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"
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
          <View className="bg-card border-t border-b border-border">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Language</Text>
              <View className="flex-row items-center">
                <Text className="text-muted-foreground mr-2">English</Text>
                <ChevronRightIcon
                  color={
                    theme === "dark"
                      ? "rgb(148, 163, 184)"
                      : "rgb(100, 116, 139)"
                  }
                  size={20}
                />
              </View>
            </Pressable>
            <View className="h-px bg-border mx-4" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Units</Text>
              <View className="flex-row items-center">
                <Text className="text-muted-foreground mr-2">Metric</Text>
                <ChevronRightIcon
                  color={
                    theme === "dark"
                      ? "rgb(148, 163, 184)"
                      : "rgb(100, 116, 139)"
                  }
                  size={20}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View className="mt-6 mb-8">
          <Text className="px-4 pb-2 text-sm font-medium text-muted-foreground">
            About
          </Text>
          <View className="bg-card border-t border-b border-border">
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">App Version</Text>
              <Text className="text-muted-foreground">1.0.0</Text>
            </Pressable>
            <View className="h-px bg-border mx-4" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Terms & Conditions</Text>
              <ChevronRightIcon
                color={
                  theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"
                }
                size={20}
              />
            </Pressable>
            <View className="h-px bg-border mx-4" />
            <Pressable className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-foreground">Privacy Policy</Text>
              <ChevronRightIcon
                color={
                  theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)"
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
