import { Tabs } from "expo-router";
import { BarChartIcon, HomeIcon, SettingsIcon } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:
          theme === "dark" ? "rgb(249, 115, 22)" : "rgb(234, 88, 12)", // primary color
        tabBarInactiveTintColor:
          theme === "dark" ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)", // muted foreground
        tabBarStyle: {
          backgroundColor:
            theme === "dark" ? "rgb(2, 8, 23)" : "rgb(255, 255, 255)", // background
          borderTopColor:
            theme === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)", // border
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarLabel: "Stats",
          tabBarIcon: ({ color, size }) => (
            <BarChartIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
