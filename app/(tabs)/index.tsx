import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/deep-work/TimePicker";
import padWithZeros from "@/lib/padWithZeros";

export default function IndexScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  const [hasStarted, setHasStarted] = useState(false);

  const handleStartTimer = () => {
    setHasStarted(true);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="gap-10">
        {!hasStarted && (
          <>
            <TimePicker
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
            />
            <View>
              <Button size="lg" className="w-full" onPress={handleStartTimer}>
                <Text className="native:text-2xl">Start</Text>
              </Button>
            </View>
          </>
        )}

        {hasStarted && (
          <>
            <View className="size-64 flex-row items-center justify-center rounded-full border-2 border-primary">
              <Text className="w-20 text-center text-6xl">
                {padWithZeros(hours, 2)}
              </Text>
              <Text className="text-6xl font-medium">:</Text>
              <Text className="w-20 text-center text-6xl">
                {padWithZeros(minutes, 2)}
              </Text>
            </View>
            <View></View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
