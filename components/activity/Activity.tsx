import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivityDayPicker from "@/components/activity/ActivityDayPicker";
import ActivityMain from "@/components/activity/ActivityMain";
import { useActivityContext } from "@/context/ActivityContext";

export default function Activity() {
  const { isLoading, selectedDate } = useActivityContext();

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-background pt-6">
        <ActivityHeader selectedDate={selectedDate} />

        <View className="mx-4 my-4 h-0.5 bg-muted"></View>

        <ActivityDayPicker />

        <View className="mx-4 my-4 h-0.5 bg-muted"></View>

        <View className="flex-1">
          <ActivityMain />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
