import Activity from "@/components/activity/Activity";
import ActivityContextProvider from "@/context/ActivityContext";

export default function ActivityScreen() {
  return (
    <ActivityContextProvider>
      <Activity />
    </ActivityContextProvider>
  );
}
