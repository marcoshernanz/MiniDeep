import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeSelector } from "@/components/TimeSelector";
import WheelNumberPicker from "@/components/ui/WheelNumberPicker";

export default function IndexScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="relative">
        <View className="flex-row items-center justify-center">
          <WheelNumberPicker
            minValue={0}
            maxValue={23}
            initialValue={hours}
            containerHeight={250}
          />
          <Text className="h-full align-middle text-6xl font-medium">:</Text>
          <WheelNumberPicker
            minValue={0}
            maxValue={59}
            interval={5}
            initialValue={minutes}
            containerHeight={250}
          />
        </View>
        <View className="absolute left-0 right-0 top-1/2 -mx-2 h-[4.5rem] -translate-y-1/2 rounded-lg border-2 border-primary"></View>
      </View>
    </SafeAreaView>
  );
}
