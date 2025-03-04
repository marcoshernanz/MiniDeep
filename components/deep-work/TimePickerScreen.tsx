import { View } from "react-native";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { Text } from "../ui/text";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface Props {
  hours: number;
  setHours: Dispatch<SetStateAction<number>>;
  minutes: number;
  setMinutes: Dispatch<SetStateAction<number>>;
  startTimer: (time: { hours: number; minutes: number }) => void;
}

export default function TimePickerScreen({
  hours,
  setHours,
  minutes,
  setMinutes,
  startTimer,
}: Props) {
  const handleStartTimer = () => {
    startTimer({ hours, minutes });
  };

  return (
    <View className="gap-10">
      <View className="relative">
        <View className="h-72 flex-row items-center justify-center">
          <WheelNumberPicker
            number={hours}
            setNumber={setHours}
            minValue={0}
            maxValue={23}
            containerHeight={256}
          />
          <Text className="h-full align-middle text-6xl font-medium">:</Text>
          <WheelNumberPicker
            number={minutes}
            setNumber={setMinutes}
            minValue={0}
            maxValue={59}
            interval={5}
            containerHeight={256}
          />
        </View>
        <View className="pointer-events-none absolute left-0 right-0 top-1/2 -mx-2 h-[4.5rem] -translate-y-1/2 rounded-lg border-2 border-primary"></View>
      </View>

      <View className="h-14">
        <Button size="lg" className="w-full" onPress={handleStartTimer}>
          <Text className="native:text-2xl">Start</Text>
        </Button>
      </View>
    </View>
  );
}
