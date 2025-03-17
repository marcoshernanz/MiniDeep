import React, { ReactNode } from "react";
import { View, Dimensions, FlatList } from "react-native";

const { width } = Dimensions.get("window");

interface SwipableProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemWidth: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  horizontal?: boolean;
}

export default function Swipable<T>({
  data,
  renderItem,
  keyExtractor,
  initialIndex = 0,
  itemWidth = width,
  onIndexChange,
  className,
  horizontal = true,
}: SwipableProps<T>) {
  const finalInitialIndex = initialIndex >= 0 ? initialIndex : data.length - 1;

  return (
    <View style={[{ width: itemWidth }]} className={className}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="normal"
        disableIntervalMomentum
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        initialScrollIndex={finalInitialIndex}
        onMomentumScrollEnd={(event) => {
          if (onIndexChange) {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / itemWidth);
            onIndexChange(index);
          }
        }}
        renderItem={({ item, index }) => (
          <View style={{ width: itemWidth }}>
            {renderItem({ item, index })}
          </View>
        )}
      />
    </View>
  );
}
