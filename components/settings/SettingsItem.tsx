import { LucideIcon } from "lucide-react-native";
import { Pressable, Switch, View } from "react-native";
import { Text } from "../ui/text";
import useColors from "@/lib/hooks/useColors";
import { useState } from "react";

interface Props {
  Icon: LucideIcon;
  text: string;
  onPress?: () => void;
  isSwitch?: boolean;
  initialIsChecked?: boolean;
}

export default function SettingsItem({
  Icon,
  text,
  onPress,
  isSwitch,
  initialIsChecked,
}: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(initialIsChecked || true);
  const { getColor } = useColors();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }

    if (isSwitch) {
      setIsChecked((prev) => !prev);
    }
  };

  return (
    <Pressable
      className="flex-1 flex-row items-center gap-3 px-5 py-3 transition active:bg-muted"
      onPress={handlePress}
    >
      <Icon color={getColor("foreground")} size={18} />
      <Text className="font-medium">{text}</Text>

      {isSwitch && (
        <View className="ml-auto">
          <Switch
            value={isChecked}
            onValueChange={handlePress}
            trackColor={{
              false: getColor("mutedForeground"),
              true: getColor("primary"),
            }}
            thumbColor={getColor("foreground")}
          />
        </View>
      )}
    </Pressable>
  );
}
