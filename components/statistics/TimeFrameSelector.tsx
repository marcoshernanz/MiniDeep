import { Pressable, View } from "react-native";
import { Text } from "../ui/Text";
import {
  statisticsTimeFrames,
  useStatisticsContext,
} from "@/context/StatisticsContext";
import cn from "@/lib/utils/cn";

export default function TimeFrameSelector() {
  const { timeFrame: selectedTimeFrame, setTimeFrame: setSelectedTimeFrame } =
    useStatisticsContext();

  return (
    <View className="mb-4 flex-row items-center justify-between gap-1.5 px-4">
      {statisticsTimeFrames.map((timeFrame) => (
        <Pressable
          key={timeFrame}
          className={cn(
            "flex-1 items-center justify-center rounded-full py-1 text-primary-foreground",
            selectedTimeFrame === timeFrame ? "bg-primary" : "bg-secondary"
          )}
          onPress={() => setSelectedTimeFrame(timeFrame)}
        >
          <Text>{timeFrame}</Text>
        </Pressable>
      ))}
    </View>
  );
}
