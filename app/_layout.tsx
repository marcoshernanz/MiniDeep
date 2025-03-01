import ThemeProvider from "@/components/ThemeProvider";
import "@/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <SafeAreaView className="flex-1 bg-background">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
