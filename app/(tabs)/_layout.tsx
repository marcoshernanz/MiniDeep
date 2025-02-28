import { Tabs } from "expo-router";
// import { BarChartIcon, HomeIcon, SettingsIcon } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          // tabBarIcon: ({ color, size }) => <HomeIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarLabel: "Stats",
          // tabBarIcon: ({ color, size }) => <BarChartIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          // tabBarIcon: ({ color, size }) => <SettingsIcon size={size} />,
        }}
      />
    </Tabs>
  );
}
