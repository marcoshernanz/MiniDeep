import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-3xl font-bold text-foreground">
            Welcome Home
          </Text>
          <Text className="mt-2 text-muted-foreground">
            Your dashboard overview
          </Text>
        </View>

        <View className="mb-4 rounded-lg bg-card p-4 border border-border">
          <Text className="text-xl font-semibold text-card-foreground">
            Quick Stats
          </Text>
          <View className="mt-4 flex-row justify-between">
            <View className="flex-1 rounded-md bg-primary p-4 mr-2">
              <Text className="text-primary-foreground font-medium">Today</Text>
              <Text className="text-2xl font-bold text-primary-foreground">
                24
              </Text>
            </View>
            <View className="flex-1 rounded-md bg-secondary p-4 ml-2">
              <Text className="text-secondary-foreground font-medium">
                Week
              </Text>
              <Text className="text-2xl font-bold text-secondary-foreground">
                142
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4 rounded-lg bg-card p-4 border border-border">
          <Text className="text-xl font-semibold text-card-foreground">
            Recent Activity
          </Text>
          <View className="mt-2 space-y-2">
            <View className="py-2 border-b border-border">
              <Text className="text-foreground">Morning workout</Text>
              <Text className="text-sm text-muted-foreground">
                30 minutes - Completed
              </Text>
            </View>
            <View className="py-2 border-b border-border">
              <Text className="text-foreground">Afternoon run</Text>
              <Text className="text-sm text-muted-foreground">
                45 minutes - Completed
              </Text>
            </View>
            <View className="py-2">
              <Text className="text-foreground">Evening yoga</Text>
              <Text className="text-sm text-muted-foreground">
                20 minutes - Completed
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4 rounded-lg bg-accent p-4">
          <Text className="text-xl font-semibold text-accent-foreground">
            Tips & Advice
          </Text>
          <Text className="mt-2 text-accent-foreground">
            Remember to stay hydrated throughout your workouts to maximize
            performance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
