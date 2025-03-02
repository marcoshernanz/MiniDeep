import { View } from "react-native";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { Text } from "../ui/text";
import { Dispatch, SetStateAction } from "react";

interface Props {
  hours: number;
  setHours: Dispatch<SetStateAction<number>>;
  minutes: number;
  setMinutes: Dispatch<SetStateAction<number>>;
}

export default function TimePicker({
  hours,
  setHours,
  minutes,
  setMinutes,
}: Props) {
  return (
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
  );
}
