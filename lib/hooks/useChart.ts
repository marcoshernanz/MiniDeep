import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureHandlerGestureEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getTransformComponents,
  setTranslate,
  useChartTransformState,
} from "victory-native";

type DataType = Array<{ [key: string]: any }>;

interface Params {
  data: DataType;
  chartRef: RefObject<View>;
  numDotsVisible: number;
  yKey: string;
}

const yDomain = [0, 100];

export default function useChart({
  data,
  chartRef,
  numDotsVisible,
  yKey,
}: Params) {
  const [chartDimensions, setChartDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const { state: transformState } = useChartTransformState();

  const xPan = useSharedValue(0);

  const [isActive, setIsActive] = useState(false);
  const pressState = {
    x: {
      value: useSharedValue<number | null>(null),
      position: useSharedValue(0),
    },
    y: {
      value: useSharedValue<number | null>(null),
      position: useSharedValue(0),
    },
  };

  useAnimatedReaction(
    () => transformState.panActive.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const { translateX } = getTransformComponents(
          transformState.matrix.value,
        );

        xPan.value = translateX;

        const interval = chartDimensions.width / (numDotsVisible - 1);
        const minPan = 0;
        const maxPan = interval * (data.length - numDotsVisible);
        const translate = minPan + Math.round(xPan.value / interval) * interval;
        const fixedTranslate = Math.max(minPan, Math.min(maxPan, translate));

        xPan.value = withTiming(fixedTranslate);
      }
    },
  );

  useAnimatedReaction(
    () => xPan.value,
    (xPan) => {
      transformState.matrix.value = setTranslate(
        transformState.matrix.value,
        xPan,
        0,
      );
    },
  );

  const updatePressState = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => {
    "worklet";
    if (
      chartDimensions.width <= 0 ||
      chartDimensions.height <= 0 ||
      numDotsVisible <= 1 ||
      yDomain[1] === yDomain[0]
    ) {
      return;
    }

    const interval = chartDimensions.width / (numDotsVisible - 1);
    const effectiveX = event.x - xPan.value;

    let closestIndex = Math.round(effectiveX / interval);
    closestIndex = Math.max(0, Math.min(data.length - 1, closestIndex));

    const closestPointX = closestIndex * interval + xPan.value;
    const clampedClosestPointX = Math.max(
      0,
      Math.min(chartDimensions.width, closestPointX),
    );
    pressState.x.position.value = clampedClosestPointX;
    pressState.x.value.value = closestIndex;

    if (data && data.length > closestIndex && closestIndex >= 0) {
      const pointData = data[closestIndex];
      if (pointData && typeof pointData[yKey] === "number") {
        const value = pointData[yKey];
        pressState.y.value.value = value;

        const yDataRange = yDomain[1] - yDomain[0];
        const normalizedY = (value - yDomain[0]) / yDataRange;
        const clampedNormalizedY = Math.max(0, Math.min(1, normalizedY));
        const closestPointY =
          chartDimensions.height - clampedNormalizedY * chartDimensions.height;

        const clampedClosestPointY = Math.max(
          0,
          Math.min(chartDimensions.height, closestPointY),
        );
        pressState.y.position.value = clampedClosestPointY;
      } else {
        pressState.y.value.value = null;
        pressState.y.position.value = 0;
      }
    } else {
      pressState.x.value.value = null;
      pressState.y.value.value = null;
      pressState.x.position.value = 0;
      pressState.y.position.value = 0;
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      "worklet";
      updatePressState(event);
      runOnJS(setIsActive)(true);
    })
    .onUpdate((event) => {
      "worklet";
      updatePressState(event);
    })
    .onFinalize(() => {
      "worklet";
      runOnJS(setIsActive)(false);
      pressState.x.value.value = null;
      pressState.y.value.value = null;
    });

  const composed = Gesture.Race(panGesture);

  useLayoutEffect(() => {
    chartRef.current?.measureInWindow((x, y, width, height) => {
      if (
        width > 0 &&
        height > 0 &&
        (chartDimensions.width !== width || chartDimensions.height !== height)
      ) {
        setChartDimensions({ x, y, width, height });
      }
    });
  }, [chartRef, chartDimensions.width, chartDimensions.height]);

  return {
    chartConfig: {
      customeGestures: composed,
      viewport: {
        x: [0, numDotsVisible - 1] as [number, number],
      },
    },
    pressState: {
      isActive: isActive,
      x: {
        value: pressState.x.value,
        position: pressState.x.position,
      },
      y: {
        value: pressState.y.value,
        position: pressState.y.position,
      },
    },
  };
}
