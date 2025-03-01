import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeSelector } from "@/components/TimeSelector";
import WheelNumberPicker from "@/components/ui/WheelNumberPicker";

export default function IndexScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  // const handleTimeChange = (min: number, sec: number) => {
  //   setMinutes(min);
  //   setSeconds(sec);
  // };

  // Format time with leading zeros
  // const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  // const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {/* <View className="aspect-square size-64 items-center justify-center rounded-full border border-primary">
        <TimeSelector
          initialMinutes={minutes}
          initialSeconds={seconds}
          onTimeChange={handleTimeChange}
        />
      </View> */}

      <WheelNumberPicker minValue={0} maxValue={59} initialValue={minutes} />
    </SafeAreaView>
  );
}
