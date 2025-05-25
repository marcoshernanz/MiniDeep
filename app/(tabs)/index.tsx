import Tracker from "@/components/tracker/Tracker";
import TrackerContextProvider from "@/context/TrackerContext";

export default function IndexScreen() {
  return (
    <TrackerContextProvider>
      <Tracker />
    </TrackerContextProvider>
  );
}
