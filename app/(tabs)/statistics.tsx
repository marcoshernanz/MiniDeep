import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useWorkStats } from "@/lib/hooks/useWorkStats";
import { ActivityIndicator } from "react-native";
import DailyWorkChart from "@/components/statistics/DailyWorkChart";
import WorkSessionsList from "@/components/statistics/WorkSessionsList";
import CompletionRateChart from "@/components/statistics/CompletionRateChart";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react-native";

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function StatsScreen() {
  const { stats, sessions, loading, refresh } = useWorkStats();
  const [isLoadingDummy, setIsLoadingDummy] = React.useState(false);

  // Use useFocusEffect instead of useEffect to only refresh when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, []),
  );

  const handleLoadDummyData = async () => {
    setIsLoadingDummy(true);
    try {
      await refresh();
    } finally {
      setIsLoadingDummy(false);
    }
  };

  return null;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-foreground">
            Loading your statistics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionRate =
    stats.totalSessions > 0
      ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-foreground">Statistics</Text>
          <Text className="mt-2 text-muted-foreground">
            Your deep work performance
          </Text>
        </View>

        {/* Summary Cards */}
        <View className="flex-row gap-4 px-4">
          <Card className="flex-1 p-4">
            <Text className="text-sm text-muted-foreground">Total Time</Text>
            <Text className="text-2xl font-semibold text-foreground">
              {formatTime(stats.totalWorkTime)}
            </Text>
          </Card>

          <Card className="flex-1 p-4">
            <Text className="text-sm text-muted-foreground">Sessions</Text>
            <Text className="text-2xl font-semibold text-foreground">
              {stats.totalSessions}
            </Text>
          </Card>
        </View>

        {stats.totalSessions === 0 && (
          <View className="mt-6 px-4">
            <Card className="p-4">
              <View className="flex-row items-center">
                <AlertCircle size={24} className="mr-3 text-primary" />
                <Text className="flex-1 text-foreground">
                  No work sessions recorded yet. Load dummy data or start your
                  first timer!
                </Text>
              </View>
              <Button
                className="mt-3"
                onPress={handleLoadDummyData}
                disabled={isLoadingDummy}
              >
                <Text>{isLoadingDummy ? "Loading..." : "Load Dummy Data"}</Text>
              </Button>
            </Card>
          </View>
        )}

        {/* Daily Work Chart */}
        <View className="mt-6 px-4">
          <Card className="p-4">
            <Text className="mb-4 text-xl font-semibold text-foreground">
              Daily Work
            </Text>
            {stats.dailyStats.length > 0 ? (
              <DailyWorkChart dailyStats={stats.dailyStats} />
            ) : (
              <View className="h-40 items-center justify-center">
                <Text className="text-center text-muted-foreground">
                  No data available yet
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Completion Rate */}
        <View className="mt-6 px-4">
          <Card className="p-4">
            <Text className="mb-2 text-xl font-semibold text-foreground">
              Session Completion
            </Text>
            <View className="flex-row items-center">
              <CompletionRateChart
                completionRate={completionRate}
                completedSessions={stats.completedSessions}
                totalSessions={stats.totalSessions}
              />

              <View className="ml-4 flex-1">
                <Text className="font-medium text-foreground">
                  {completionRate >= 70
                    ? "Great completion rate!"
                    : completionRate >= 40
                      ? "Making good progress"
                      : stats.totalSessions > 0
                        ? "Keep pushing yourself"
                        : "Start your first session"}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  {stats.completedSessions} of {stats.totalSessions} sessions
                  completed fully
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Recent Sessions */}
        <View className="mt-6 px-4 pb-8">
          <Card className="p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-foreground">
                Recent Sessions
              </Text>

              {stats.totalSessions > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onPress={handleLoadDummyData}
                  disabled={isLoadingDummy}
                >
                  <Text className="text-xs">
                    {isLoadingDummy ? "Loading..." : "Refresh Data"}
                  </Text>
                </Button>
              )}
            </View>
            <View className="mt-4">
              <WorkSessionsList sessions={sessions} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
