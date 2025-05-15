import { useTrackerContext } from "@/context/TrackerContext";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackerPickerScreen from "./TrackerPickerScreen";
import Timer from "./timer/Timer";
import Stopwatch from "./stopwatch/Stopwatch";

export default function Tracker() {
  const { trackerType } = useTrackerContext();

  return (
    <SafeAreaView className="flex-1">
      {trackerType === null && <TrackerPickerScreen />}

      {trackerType === "timer" && <Timer />}

      {trackerType === "stopwatch" && <Stopwatch />}
    </SafeAreaView>
  );
}
