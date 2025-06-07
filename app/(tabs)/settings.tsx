import { View, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { seedWorkSessions, clearWorkSessions } from "@/lib/seedData";
import SettingsGroup from "@/components/settings/SettingsGroup";
import SettingsItem from "@/components/settings/SettingsItem";
import Constants from "expo-constants";
import { UploadIcon } from "@/lib/icons/UploadIcon";
import { EraserIcon } from "@/lib/icons/EraserIcon";
import { HeartIcon } from "@/lib/icons/HeartIcon";
import { useState } from "react";
import * as StoreReview from "expo-store-review";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT;
const isProduction = appVariant !== "development" && appVariant !== "preview";

export default function SettingsScreen() {
  const [isSupportDialogVisible, setIsSupportDialogVisible] = useState(false);

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

  const rateApp = async () => {
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      } else {
        const url = StoreReview.storeUrl();
        if (url) {
          Linking.openURL(url);
        }
      }
    } catch (e) {
      console.error(e);
    }

    setIsSupportDialogVisible(false);
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
          <SettingsGroup>
            <SettingsItem
              Icon={HeartIcon}
              text="Support the Project"
              onPress={() => setIsSupportDialogVisible(true)}
            />
            <AlertDialog
              open={isSupportDialogVisible}
              onOpenChange={setIsSupportDialogVisible}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Support the Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    This app is 100% free and serves no ads, which means that I
                    don't make any money from it. Show some love by leaving a
                    5-star review!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={rateApp}>
                    <Text>Support</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsGroup>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
