import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useWorkStats } from "@/lib/hooks/useWorkStats";
import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";
import { format, startOfWeek, addDays, getHours } from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useColors from "@/lib/hooks/useColors";
import { ActivityIndicator } from "react-native";
import { WorkSession } from "@/config/timeTrackingConfig";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivityDayPicker from "@/components/activity/ActivityDayPicker";

const { width } = Dimensions.get("window");

export default function ActivityScreen() {
  const { stats, sessions, loading, refresh } = useWorkStats();
  const colors = useColors();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date()));
  const [daysSessions, setDaysSessions] = useState<WorkSession[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<
    { hour: number; duration: number }[]
  >([]);
  const scrollRef = useRef<ScrollView>(null);

  // Format time function
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate sessions for the selected day
  useEffect(() => {
    if (!sessions.length) return;

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    const filteredSessions = sessions.filter((session) => {
      const sessionDate = format(new Date(session.startTime), "yyyy-MM-dd");
      return sessionDate === selectedDateStr;
    });

    setDaysSessions(filteredSessions);

    // Calculate hourly distribution
    const hourlyData = Array(24)
      .fill(0)
      .map((_, i) => ({ hour: i, duration: 0 }));

    filteredSessions.forEach((session) => {
      let lastStartTime: number | null = null;

      for (const event of session.events) {
        if (event.action === "start" || event.action === "resume") {
          lastStartTime = event.timestamp;
        } else if (
          (event.action === "pause" ||
            event.action === "stop" ||
            event.action === "complete") &&
          lastStartTime
        ) {
          const startHour = getHours(new Date(lastStartTime));
          const workTime = (event.timestamp - lastStartTime) / 1000;
          hourlyData[startHour].duration += workTime;
          lastStartTime = null;
        }
      }
    });

    setHourlyDistribution(hourlyData);
  }, [selectedDate, sessions]);

  // Handle day selection
  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newWeekStart = addDays(weekStartDate, -7);
    setWeekStartDate(newWeekStart);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newWeekStart = addDays(weekStartDate, 7);
    setWeekStartDate(newWeekStart);
  };

  // Calculate total work time for the selected day
  const totalDayTime = daysSessions.reduce((total, session) => {
    let sessionTime = 0;
    let lastStartTime: number | null = null;

    for (const event of session.events) {
      if (event.action === "start" || event.action === "resume") {
        lastStartTime = event.timestamp;
      } else if (
        (event.action === "pause" ||
          event.action === "stop" ||
          event.action === "complete") &&
        lastStartTime
      ) {
        sessionTime += (event.timestamp - lastStartTime) / 1000;
        lastStartTime = null;
      }
    }

    return total + sessionTime;
  }, 0);

  // Calculate completion rate for the selected day
  const completionRate =
    daysSessions.length > 0
      ? Math.round(
          (daysSessions.filter((s) => s.completed).length /
            daysSessions.length) *
            100,
        )
      : 0;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-foreground">
            Loading your activity data...
          </Text>
        </View>
      </SafeAreaView>
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
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
