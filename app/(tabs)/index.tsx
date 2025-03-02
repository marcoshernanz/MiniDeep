import { useState } from "react";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/deep-work/TimePicker";

export default function IndexScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="gap-10">
        <TimePicker
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
        />
        <View>
          <Button size="lg" className="w-full">
            <Text className="native:text-2xl">Start</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
