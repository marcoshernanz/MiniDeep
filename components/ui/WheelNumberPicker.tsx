import { useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "./text";
import { LinearGradient } from "expo-linear-gradient";
import useColors from "@/lib/hooks/useColors";
import cn from "@/lib/cn";

interface Props {
  minValue: number;
  maxValue: number;
  interval?: number;
  initialValue?: number;

  containerHeight?: number;
  itemsPerContainer?: number;
}

export default function WheelNumberPicker({
  minValue,
  maxValue,
  interval = 1,
  initialValue,

  containerHeight = 200,
  itemsPerContainer = 3,
}: Props) {
  const colors = useColors();

  const [selectedNumber, setSelectedNumber] = useState(
    initialValue ?? minValue,
  );

  const itemHeight = containerHeight / itemsPerContainer;

  const numberValues = Array.from(
    { length: Math.floor((maxValue - minValue) / interval) + 1 },
    (_, i) => minValue + i * interval,
  );
  const values = [-1, ...numberValues, -1];

  return (
    <View
      className="overflow-hidden"
      style={{ height: containerHeight, width: itemHeight }}
    >
      <FlatList
        data={values}
        keyExtractor={(value, index) => `${value.toString()}-${index}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="normal"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / itemHeight,
          );
          setSelectedNumber(values[index + 1]);
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
              className={cn(item === -1 && "opacity-0")}
              style={{ fontSize: itemHeight / 2, lineHeight: itemHeight / 2 }}
            >
              {item}
            </Text>
          </View>
        )}
      />
      <LinearGradient
        colors={[colors.background, "transparent", colors.background]}
        className="pointer-events-none absolute inset-0"
      />
    </View>
  );
}
