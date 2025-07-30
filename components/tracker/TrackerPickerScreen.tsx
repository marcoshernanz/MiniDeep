import { View } from "react-native";
import Swipable from "../Swipable";
import StopwatchStartScreen from "./stopwatch/StopwatchStartScreen";
import TimerTimePickerScreen from "./timer/TimerTimePickerScreen";
import cn from "@/lib/utils/cn";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackerPickerScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <SafeAreaView className="flex-1 bg-background pb-16 pt-6">
      <Swipable
        data={[null, null]}
        keyExtractor={(value, index) => `${value}-${index}`}
        className="flex-1"
        renderItem={({ index }) => (
          <>
            {index === 0 && <TimerTimePickerScreen />}
            {index === 1 && <StopwatchStartScreen />}
          </>
        )}
        onIndexChange={setActiveIndex}
        currentIndex={activeIndex}
      />
      <View className="absolute bottom-24 left-1/2 -translate-x-1/2 flex-row items-center justify-center">
        <View
          className={cn(
            "mr-3 size-3 rounded-full bg-muted",
            activeIndex === 0 && "bg-primary"
          )}
        ></View>
        <View
          className={cn(
            "size-3 rounded-full bg-muted",
            activeIndex === 1 && "bg-primary"
          )}
        ></View>
      </View>
    </SafeAreaView>
  );
}
