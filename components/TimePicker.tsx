import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import cn from "@/lib/cn";

interface TimePickerProps {
  minValue: number;
  maxValue: number;
  interval?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

const pickerHeight = 200;
const itemHeight = 100;

export const TimePicker: React.FC<TimePickerProps> = ({
  minValue,
  maxValue,
  interval = 1,
  initialValue,
  onValueChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue || minValue);

  const values = Array.from(
    { length: Math.floor((maxValue - minValue) / interval) + 1 },
    (_, i) => minValue + i * interval,
  );

  const flatListRef = useRef<FlatList>(null);

  // Add padding items to the beginning and end
  const paddingCount = Math.floor(pickerHeight / itemHeight / 2);
  const paddedValues = [
    ...Array(paddingCount).fill(null),
    ...values,
    ...Array(paddingCount).fill(null),
  ];

  // Format the value with leading zero if needed
  const formatValue = (value: number | null) => {
    if (value === null) return "";
    return value < 10 ? `0${value}` : `${value}`;
  };

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);

    if (index >= paddingCount && index < paddingCount + values.length) {
      const newValue = values[index - paddingCount];
      if (newValue !== selectedValue) {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
      }
    }
  };

  const snapToOffsets = paddedValues.map((_, i) => i * itemHeight);

  return (
    <View className="h-48">
      <View style={styles.pickerContainer}>
        <FlatList
          ref={flatListRef}
          data={paddedValues}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToOffsets={snapToOffsets}
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          initialScrollIndex={
            paddingCount + (initialValue ? values.indexOf(initialValue) : 0)
          }
          contentContainerStyle={{
            paddingVertical: (pickerHeight - itemHeight) / 2,
          }}
          renderItem={({ item, index }) => {
            const isSelected =
              index >= paddingCount &&
              index < paddingCount + values.length &&
              values[index - paddingCount] === selectedValue;

            return (
              <View className="h-16 items-center justify-center">
                <Text
                  // className={`text-2xl ${isSelected ? "font-semibold text-primary" : "text-foreground/70"}`}
                  className={cn(
                    "text-2xl text-muted-foreground",
                    isSelected && "font-semibold text-foreground",
                  )}
                >
                  {formatValue(item)}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    position: "relative",
  },
  selectionOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#0EA5E9", // primary color
    zIndex: 1,
    backgroundColor: "rgba(14, 165, 233, 0.05)", // primary color with opacity
    pointerEvents: "none",
  },
});
