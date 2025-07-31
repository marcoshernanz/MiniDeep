import { useTrackerContext } from "@/context/OLDTrackerContext";
import TrackerPickerScreen from "./TrackerPickerScreen";
import Timer from "./timer/Timer";
import Stopwatch from "./stopwatch/Stopwatch";

export default function Tracker() {
  const { trackerType } = useTrackerContext();

  return (
    <>
      {trackerType === null && <TrackerPickerScreen />}

      {trackerType === "timer" && <Timer />}

      {trackerType === "stopwatch" && <Stopwatch />}
    </>
  );
}
