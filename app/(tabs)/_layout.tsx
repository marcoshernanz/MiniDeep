import { Tabs } from "expo-router";
import { forwardRef } from "react";
import { Pressable, PressableProps, View } from "react-native";
import getColor from "@/lib/utils/getColor";
import {
  ActivityIcon,
  BarChartIcon,
  BrainIcon,
  SettingsIcon,
} from "lucide-react-native";

const TabBarPressableButton = forwardRef<any, PressableProps>((props, ref) => (
  <Pressable
    {...props}
    ref={ref}
    android_ripple={{ color: getColor("muted"), borderless: true }}
  />
));
TabBarPressableButton.displayName = "TabBarPressableButton";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
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
          tabBarButton: (props) => <TabBarPressableButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Deep Work",
            tabBarIcon: ({ color, size }) => (
              <BrainIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            tabBarLabel: "Activity",
            tabBarIcon: ({ color, size }) => (
              <ActivityIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            tabBarLabel: "Statistics",
            tabBarIcon: ({ color, size }) => (
              <BarChartIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} strokeWidth={1.75} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
