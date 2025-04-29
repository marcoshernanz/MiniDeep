import { FlatList, View } from "react-native";
import { Text } from "./text";
import { LinearGradient } from "expo-linear-gradient";
import cn from "@/lib/utils/cn";
import useColors from "@/lib/hooks/useColors";
import React, { useRef, forwardRef, useImperativeHandle, useMemo } from "react";

interface Props {
  minValue: number;
  maxValue: number;
  interval?: number;
  containerHeight?: number;
  itemsPerContainer?: number;
  number: number;
  setNumber: (number: number) => void;
}

export interface WheelNumberPickerHandle {
  scrollToNumber: (value: number) => void;
}

const WheelNumberPicker = forwardRef<WheelNumberPickerHandle, Props>(
  (
    {
      minValue,
      maxValue,
      interval = 1,
      containerHeight = 200,
      itemsPerContainer = 3,
      number,
      setNumber,
    },
    ref,
  ) => {
    const { getColor } = useColors();

    const itemHeight = containerHeight / itemsPerContainer;

    const numberValues = useMemo(
      () =>
        Array.from(
          { length: Math.floor((maxValue - minValue) / interval) + 1 },
          (_, i) => minValue + i * interval,
        ),
      [minValue, maxValue, interval],
    );
    const values = useMemo(() => [-1, ...numberValues, -1], [numberValues]);

    const flatListRef = useRef<FlatList<any> | null>(null);
    useImperativeHandle(
      ref,
      () => ({
        scrollToNumber: (value: number) => {
          const idx = values.indexOf(value) - 1;
          flatListRef.current?.scrollToIndex({ index: idx, animated: true });
        },
      }),
      [values],
    );

    return (
      <View
        className="overflow-hidden"
        style={{ height: containerHeight, width: itemHeight }}
      >
        <FlatList
          ref={flatListRef}
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
          initialScrollIndex={values.indexOf(number) - 1}
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
          colors={[
            getColor("background"),
            "transparent",
            getColor("background"),
          ]}
          className="pointer-events-none absolute inset-0"
        />
      </View>
    );
  },
);

export default WheelNumberPicker;
