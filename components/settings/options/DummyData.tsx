import { useAppContext } from "@/context/AppContext";
import SettingsGroup from "../SettingsGroup";
import SettingsItem from "../SettingsItem";
import { Toast } from "@/components/ui/Toast";
import Constants from "expo-constants";

export default function DummyData() {
  const { setAppData } = useAppContext();
  const appVariant = Constants.expoConfig?.extra?.APP_VARIANT;
  const showDummyData =
    appVariant === "development" || appVariant === "preview";

  if (!showDummyData) return null;

  const loadDummyData = () => {
    // TODO

    setAppData(() => ({
      sessions: [],
    }));

    Toast.show({ text: "Dummy data loaded", variant: "success" });
  };

  const clearDummyData = () => {
    setAppData(() => ({
      sessions: [],
    }));

    Toast.show({ text: "Dummy data cleared", variant: "success" });
  };

  return (
    <SettingsGroup>
      <SettingsItem text="Load Dummy Data" onPress={loadDummyData} />
      <SettingsItem text="Clear Dummy Data" onPress={clearDummyData} />
    </SettingsGroup>
  );
}
