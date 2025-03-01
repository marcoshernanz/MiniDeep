import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { TimePicker } from "./TimePicker";

interface TimeSelectorProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onTimeChange?: (minutes: number, seconds: number) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  initialMinutes = 30,
  initialSeconds = 0,
  onTimeChange,
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  const handleMinuteChange = (value: number) => {
    setMinutes(value);
    onTimeChange?.(value, seconds);
  };

  const handleSecondChange = (value: number) => {
    setSeconds(value);
    onTimeChange?.(minutes, value);
  };

  return (
    <View className="flex-row items-center justify-center">
      <TimePicker
        minValue={0}
        maxValue={59}
        initialValue={minutes}
        onValueChange={handleMinuteChange}
        label="MINUTES"
      />
      <Text className="mx-2 text-4xl text-primary">:</Text>
      <TimePicker
        minValue={0}
        maxValue={59}
        initialValue={seconds}
        onValueChange={handleSecondChange}
        label="SECONDS"
      />
    </View>
  );
};
