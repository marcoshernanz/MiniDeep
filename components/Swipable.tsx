import React, {
  ReactNode,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Dimensions, FlatList } from "react-native";

const { width } = Dimensions.get("window");

interface SwipableProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemWidth?: number;
  initialIndex?: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  horizontal?: boolean;
}

export interface SwipableRef {
  scrollToIndex: (params: { index: number; animated?: boolean }) => void;
}

function SwipableImpl<T>(props: SwipableProps<T>, ref: React.Ref<SwipableRef>) {
  const {
    data,
    renderItem,
    keyExtractor,
    initialIndex = 0,
    currentIndex,
    onIndexChange,
    className,
    itemWidth = width,
    horizontal = true,
  } = props;

  const finalInitialIndex = initialIndex >= 0 ? initialIndex : data.length - 1;
  const flatListRef = useRef<FlatList<T>>(null);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (params) => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex(params);
      }
    },
  }));

  useEffect(() => {
    if (currentIndex !== undefined && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  return (
    <View style={[{ width: itemWidth }]} className={className}>
      <FlatList<T>
        ref={flatListRef}
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
            const newIndex = Math.round(offsetX / itemWidth);
            onIndexChange(newIndex);
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

const Swipable = forwardRef(SwipableImpl) as <T>(
  props: SwipableProps<T> & { ref?: React.Ref<SwipableRef> },
) => React.ReactElement;

export default Swipable;
