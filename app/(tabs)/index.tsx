import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeSelector } from "@/components/TimeSelector";
import WheelNumberPicker from "@/components/ui/WheelNumberPicker";
import { Button } from "@/components/ui/button";

export default function IndexScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="gap-10">
        <View className="relative">
          <View className="flex-row items-center justify-center">
            <WheelNumberPicker
              number={hours}
              setNumber={setHours}
              minValue={0}
              maxValue={23}
              containerHeight={250}
            />
            <Text className="h-full align-middle text-6xl font-medium">:</Text>
            <WheelNumberPicker
              number={minutes}
              setNumber={setMinutes}
              minValue={0}
              maxValue={59}
              interval={5}
              containerHeight={250}
            />
          </View>
          <View className="pointer-events-none absolute left-0 right-0 top-1/2 -mx-2 h-[4.5rem] -translate-y-1/2 rounded-lg border-2 border-primary"></View>
        </View>
        <View>
          <Button size="lg" className="w-full">
            <Text className="native:text-2xl">Start</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
