import { View } from "react-native";
import React, { useRef } from "react";
import WheelNumberPicker, {
  WheelNumberPickerHandle,
} from "../../ui/WheelNumberPicker";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import extractTime from "@/lib/utils/extractTime";
import { useTimerContext } from "@/context/TimerContext";

export default function TimePickerScreen() {
  const {
    selectedTime,
    setSelectedTime,
    timer: { startTimer },
  } = useTimerContext();

  const minutesPickerRef = useRef<WheelNumberPickerHandle>(null);
  const { hours, minutes } = extractTime(selectedTime);

  const handleSetTime = ({
    hours,
    minutes,
  }: {
    hours?: number;
    minutes?: number;
  }) => {
    const { hours: currentHours, minutes: currentMinutes } =
      extractTime(selectedTime);

    const newHours = hours !== undefined ? hours : currentHours;
    const newMinutes = minutes !== undefined ? minutes : currentMinutes;

    let adjustedHours = newHours;
    let adjustedMinutes = newMinutes;
    if (adjustedHours === 0 && adjustedMinutes === 0) {
      adjustedMinutes = 1;
      minutesPickerRef.current?.scrollToNumber(adjustedMinutes);
    }

    setSelectedTime((adjustedHours * 3600 + adjustedMinutes * 60) * 1000);
  };

  return (
    <View className="gap-10">
      <View className="relative">
        <View className="h-72 flex-row items-center justify-center">
          <WheelNumberPicker
            number={hours}
            setNumber={(hours) => handleSetTime({ hours })}
            minValue={0}
            maxValue={23}
            containerHeight={256}
          />
          <Text className="h-full align-middle text-6xl font-medium">:</Text>
          <WheelNumberPicker
            ref={minutesPickerRef}
            number={minutes}
            setNumber={(minutes) => handleSetTime({ minutes })}
            minValue={0}
            maxValue={59}
            interval={1}
            containerHeight={256}
          />
        </View>
        <View className="pointer-events-none absolute left-0 right-0 top-1/2 -mx-2 h-[4.5rem] -translate-y-1/2 rounded-lg border-2 border-primary"></View>
      </View>

      <View className="h-14">
        <Button
          size="lg"
          className="w-full"
          onPress={() => startTimer(selectedTime)}
        >
          <Text className="native:text-2xl">Start</Text>
        </Button>
      </View>
    </View>
  );
}
