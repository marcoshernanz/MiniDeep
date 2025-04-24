import { Pressable, View } from "react-native";
import { StatisticsTimeFrame } from "@/lib/hooks/useStatistics";
import { Text } from "../ui/text";

interface Props {
  timeFrames: StatisticsTimeFrame[];
  selectedTimeFrame: StatisticsTimeFrame;
  setSelectedTimeFrame: (timeFrame: StatisticsTimeFrame) => void;
}

export default function TimeFrameSelector({
  timeFrames,
  selectedTimeFrame,
  setSelectedTimeFrame,
}: Props) {
  return (
    <View className="mb-4 flex-row items-center justify-between gap-1.5 px-4">
      {timeFrames.map((timeFrame) => (
        <Pressable
          key={timeFrame}
          className={`flex-1 items-center justify-center rounded-full py-1 text-primary-foreground ${
            selectedTimeFrame === timeFrame ? "bg-primary" : "bg-secondary"
          }`}
          onPress={() => setSelectedTimeFrame(timeFrame)}
        >
          <Text className="text-white">{timeFrame}</Text>
        </Pressable>
      ))}
    </View>
  );
}
