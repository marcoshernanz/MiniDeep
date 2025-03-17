import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivityDayPicker from "@/components/activity/ActivityDayPicker";
import useActivity from "@/lib/hooks/useActivity";
import ActivityMain from "@/components/activity/ActivityMain";

export default function ActivityScreen() {
  const { activity, loading, refresh } = useActivity();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-background py-6">
        <ScrollView className="flex-1">
          <ActivityHeader selectedDate={selectedDate} />

          <View className="mx-4 mb-2 mt-4 h-0.5 bg-muted"></View>

          <ActivityDayPicker
            days={activity.map((a) => a.date)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <View className="mx-4 mb-4 mt-2 h-0.5 bg-muted"></View>

          <ActivityMain
            activity={activity}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
