import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-foreground">Statistics</Text>
          <Text className="mt-2 text-muted-foreground">
            Your performance metrics
          </Text>
        </View>

        <View className="mb-4 rounded-lg border border-border bg-card p-4">
          <Text className="text-xl font-semibold text-card-foreground">
            Weekly Summary
          </Text>
          <View className="mt-4 h-40 flex-row items-end justify-around">
            <View
              style={{ height: "40%" }}
              className="w-8 rounded-t-sm bg-chart-1"
            ></View>
            <View
              style={{ height: "70%" }}
              className="w-8 rounded-t-sm bg-chart-2"
            ></View>
            <View
              style={{ height: "30%" }}
              className="w-8 rounded-t-sm bg-chart-3"
            ></View>
            <View
              style={{ height: "80%" }}
              className="w-8 rounded-t-sm bg-chart-4"
            ></View>
            <View
              style={{ height: "50%" }}
              className="w-8 rounded-t-sm bg-chart-5"
            ></View>
            <View
              style={{ height: "65%" }}
              className="w-8 rounded-t-sm bg-primary"
            ></View>
            <View
              style={{ height: "45%" }}
              className="w-8 rounded-t-sm bg-secondary"
            ></View>
          </View>
          <View className="mt-2 flex-row justify-around">
            <Text className="text-xs text-muted-foreground">Mon</Text>
            <Text className="text-xs text-muted-foreground">Tue</Text>
            <Text className="text-xs text-muted-foreground">Wed</Text>
            <Text className="text-xs text-muted-foreground">Thu</Text>
            <Text className="text-xs text-muted-foreground">Fri</Text>
            <Text className="text-xs text-muted-foreground">Sat</Text>
            <Text className="text-xs text-muted-foreground">Sun</Text>
          </View>
        </View>

        <View className="mb-4 rounded-lg border border-border bg-card p-4">
          <Text className="text-xl font-semibold text-card-foreground">
            Performance Metrics
          </Text>

          <View className="mt-4 space-y-4">
            <View>
              <View className="flex-row justify-between">
                <Text className="text-foreground">Endurance</Text>
                <Text className="text-foreground">75%</Text>
              </View>
              <View className="mt-1 h-2 rounded-full bg-muted">
                <View
                  style={{ width: "75%" }}
                  className="h-2 rounded-full bg-primary"
                ></View>
              </View>
            </View>

            <View>
              <View className="flex-row justify-between">
                <Text className="text-foreground">Strength</Text>
                <Text className="text-foreground">60%</Text>
              </View>
              <View className="mt-1 h-2 rounded-full bg-muted">
                <View
                  style={{ width: "60%" }}
                  className="h-2 rounded-full bg-blue"
                ></View>
              </View>
            </View>

            <View>
              <View className="flex-row justify-between">
                <Text className="text-foreground">Flexibility</Text>
                <Text className="text-foreground">45%</Text>
              </View>
              <View className="mt-1 h-2 rounded-full bg-muted">
                <View
                  style={{ width: "45%" }}
                  className="h-2 rounded-full bg-green"
                ></View>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-4 rounded-lg border border-border bg-card p-4">
          <Text className="text-xl font-semibold text-card-foreground">
            Monthly Goals
          </Text>
          <View className="mt-4 flex-row items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-primary">
              <Text className="text-2xl font-bold text-foreground">68%</Text>
              <Text className="text-xs text-muted-foreground">Complete</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-medium text-foreground">
                You're making great progress!
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Keep up the good work to reach your monthly targets.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
