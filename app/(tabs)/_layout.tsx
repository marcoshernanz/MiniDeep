import { Tabs } from "expo-router";
import { BrainIcon } from "@/lib/icons/BrainIcon";
import { ActivityIcon } from "@/lib/icons/ActivityIcon";
import { BarChartIcon } from "@/lib/icons/BarChartIcon";
import { SettingsIcon } from "@/lib/icons/SettingsIcon";
import getColor from "@/lib/getColor";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getColor("primary"),
        tabBarInactiveTintColor: getColor("mutedForeground"),
        tabBarStyle: {
          backgroundColor: getColor("background"),
          borderColor: getColor("border"),
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
        name="activity"
        options={{
          tabBarLabel: "Activity",
          tabBarIcon: ({ color, size }) => (
            <ActivityIcon color={color} size={size} />
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
