import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EraserIcon, MoonIcon, UploadIcon } from "lucide-react-native";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { seedWorkSessions, clearWorkSessions } from "@/lib/seedData";
import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";

const isProduction =
  process.env.APP_VARIANT !== "development" &&
  process.env.APP_VARIANT !== "preview";

export default function SettingsScreen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const seedData = async () => {
    try {
      await seedWorkSessions();
      Alert.alert("Success", "Dummy data seeded");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to seed data");
    }
  };

  const clearData = async () => {
    try {
      await clearWorkSessions();
      Alert.alert("Success", "Data cleared");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to clear data");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
          <Text className="mt-2 text-muted-foreground">
            Configure your app preferences
          </Text>
        </View>

        {!isProduction && (
          <View className="gap-4">
            <SettingsGroup>
              <SettingsItem
                Icon={MoonIcon}
                text="Dark Mode"
                onPress={() =>
                  setColorScheme(isDarkColorScheme ? "light" : "dark")
                }
                isSwitch={true}
                initialIsChecked={isDarkColorScheme}
              />
            </SettingsGroup>

            <SettingsGroup>
              <SettingsItem
                Icon={UploadIcon}
                text="Seed Dummy Data"
                onPress={seedData}
              />
              <SettingsItem
                Icon={EraserIcon}
                text="Clear Dummy Data"
                onPress={clearData}
              />
            </SettingsGroup>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
