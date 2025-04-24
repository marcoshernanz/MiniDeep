import { FlatList, View } from "react-native";
import { Text } from "./text";
import { LinearGradient } from "expo-linear-gradient";
import cn from "@/lib/utils/cn";
import useColors from "@/lib/hooks/useColors";

interface Props {
  minValue: number;
  maxValue: number;
  interval?: number;
  containerHeight?: number;
  itemsPerContainer?: number;
  number: number;
  setNumber: (number: number) => void;
}

export default function WheelNumberPicker({
  minValue,
  maxValue,
  interval = 1,
  containerHeight = 200,
  itemsPerContainer = 3,
  number,
  setNumber,
}: Props) {
  const { getColor } = useColors();

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
          setNumber(values[index + 1]);
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={number ? values.indexOf(number) - 1 : 0}
        renderItem={({ item }) => (
          <View
            className="items-center justify-center"
            style={{ height: itemHeight }}
          >
            <Text
              className={cn("align-middle", item === -1 && "opacity-0")}
              style={{
                fontSize: itemHeight / 2,
                height: itemHeight,
                lineHeight: itemHeight,
              }}
            >
              {item >= 0 ? item.toString().padStart(2, "0") : ""}
            </Text>
          </View>
        )}
      />
      <LinearGradient
        colors={[getColor("background"), "transparent", getColor("background")]}
        className="pointer-events-none absolute inset-0"
      />
    </View>
  );
}
