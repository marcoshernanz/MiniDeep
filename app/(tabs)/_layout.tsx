import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { BarChartIcon, BrainIcon, SettingsIcon } from "lucide-react-native";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme.primary,
        tabBarInactiveTintColor: colorScheme.mutedForeground,
        tabBarStyle: {
          backgroundColor: colorScheme.background,
          borderColor: colorScheme.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Deep Work",
          tabBarIcon: ({ color, size }) => (
            <BrainIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarLabel: "Statistics",
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
