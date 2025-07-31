import { useMemo, useRef, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Text from "./Text";
import { LinearGradient } from "expo-linear-gradient";
import getColor from "@/lib/utils/getColor";

interface Props {
  value: number;
  onValueChange: (value: number) => void;
  height: number;
  fontSize?: number;
  min: number;
  max: number;
  interval?: number;
  padWithZeros?: boolean;
}

export default function WheelNumberPicker({
  value,
  onValueChange,
  height,
  fontSize = 50,
  min,
  max,
  interval = 1,
  padWithZeros = false,
}: Props) {
  const values = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = min; i <= max; i += interval) {
      result.push(i);
    }
    return [null, ...result, null];
  }, [min, max, interval]);

  const listRef = useRef<FlatList<number | null>>(null);
  const itemHeight = height / 3;

  useEffect(() => {
    const index = values.findIndex((v) => v === value) - 1;
    if (index >= 0 && listRef.current) {
      listRef.current.scrollToOffset({
        offset: index * itemHeight,
        animated: false,
      });
    }
  }, [value, values, itemHeight]);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight) + 1;
    const item = values[index];
    if (item != null && item !== value) {
      onValueChange(item);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={listRef}
        data={values}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        overScrollMode="never"
        getItemLayout={(_, idx) => ({
          length: itemHeight,
          offset: idx * itemHeight,
          index: idx,
        })}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.text,
              { height: height / 3, fontSize, opacity: item == null ? 0 : 1 },
            ]}
          >
            {item != null
              ? item
                  .toString()
                  .padStart(padWithZeros ? max.toString().length : 0, "0")
              : ""}
          </Text>
        )}
      />

      <LinearGradient
        colors={[getColor("background"), getColor("background", 0)]}
        style={[styles.gradient, { height: height / 3, top: 0 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[getColor("background", 0), getColor("background")]}
        style={[styles.gradient, { height: height / 3, bottom: 0 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  text: {
    fontWeight: 400,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    ...(Platform.OS === "android" ? { fontFeatureSettings: "tnum" } : {}),
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
