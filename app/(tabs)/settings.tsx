import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EraserIcon, UploadIcon } from "lucide-react-native";
import { seedWorkSessions, clearWorkSessions } from "@/lib/seedData";
import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import Constants from "expo-constants";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT;
const isProduction = appVariant !== "development" && appVariant !== "preview";

export default function SettingsScreen() {
  const seedData = async () => {
    try {
      seedWorkSessions();
      Alert.alert("Success", "Dummy data seeded");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to seed data");
    }
  };

  const clearData = async () => {
    try {
      clearWorkSessions();
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

        <View className="gap-4">
          {!isProduction && (
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
