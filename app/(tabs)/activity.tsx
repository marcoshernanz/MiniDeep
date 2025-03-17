import React, { useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivityDayPicker from "@/components/activity/ActivityDayPicker";
import useActivity from "@/lib/hooks/useActivity";
import ActivitySummary from "@/components/activity/ActivitySummary";

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
            days={Array.from({ length: 120 }, (_, i) => {
              const startDate = new Date(2024, 0, 1);
              startDate.setDate(startDate.getDate() + i);
              return startDate;
            })}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <View className="mx-4 mb-4 mt-2 h-0.5 bg-muted"></View>

          <ActivitySummary
            totalTime={activity.totalWorkTime}
            totalSessions={activity.totalSessions}
          />

          <View className="mx-4 mt-4 h-0.5 bg-muted"></View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
