import { useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "./text";
import { LinearGradient } from "expo-linear-gradient";
import useColors from "@/lib/hooks/useColors";

interface Props {
  minValue: number;
  maxValue: number;
  interval?: number;
  initialValue?: number;
}

export default function WheelNumberPicker({
  minValue,
  maxValue,
  interval = 1,
  initialValue,
}: Props) {
  const colors = useColors();

  const [selectedNumber, setSelectedNumber] = useState(
    initialValue ?? minValue,
  );

  const containerHeight = 300;
  const itemsPerContainer = 3;
  const itemHeight = containerHeight / itemsPerContainer;

  const values = Array.from(
    { length: Math.floor((maxValue - minValue) / interval) + 1 },
    (_, i) => minValue + i * interval,
  );

  return (
    <View
      className="overflow-hidden"
      style={{ height: containerHeight, width: itemHeight }}
    >
      <FlatList
        data={values}
        keyExtractor={(value) => value.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / itemHeight,
          );
          setSelectedNumber(values[index]);
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={initialValue ? values.indexOf(initialValue) - 1 : 0}
        renderItem={({ item }) => (
          <View
            className="items-center justify-center"
            style={{ height: itemHeight }}
          >
            <Text
              style={{ fontSize: itemHeight / 2, lineHeight: itemHeight / 2 }}
            >
              {item}
            </Text>
          </View>
        )}
      />
      <LinearGradient
        colors={[colors.background, "transparent", colors.background]}
        className="absolute inset-0"
      />
    </View>
  );
}
