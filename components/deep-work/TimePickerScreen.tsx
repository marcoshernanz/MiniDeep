import { View } from "react-native";
import WheelNumberPicker from "../ui/WheelNumberPicker";
import { Text } from "../ui/text";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import extractTime from "@/lib/utils/extractTime";

interface Props {
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  startTimer: (time: number) => void;
}

export default function TimePickerScreen({ time, setTime, startTimer }: Props) {
  const { hours, minutes } = extractTime(time);

  const handleSetTime = ({
    hours,
    minutes,
  }: {
    hours?: number;
    minutes?: number;
  }) => {
    const { hours: currentHours, minutes: currentMinutes } = extractTime(time);

    const newHours = hours !== undefined ? hours : currentHours;
    const newMinutes = minutes !== undefined ? minutes : currentMinutes;

    setTime((newHours * 3600 + newMinutes * 60) * 1000);
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
          // onPress={() => startTimer(time)}
          onPress={() => startTimer(5000)}
        >
          <Text className="native:text-2xl">Start</Text>
        </Button>
      </View>
    </View>
  );
}
