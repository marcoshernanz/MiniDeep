import { RefObject, useLayoutEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getTransformComponents,
  setTranslate,
  useChartTransformState,
} from "victory-native";

interface Params {
  data: any[];
  chartRef: RefObject<View>;
  numDotsVisible?: number;
}

export default function useChart({
  data,
  chartRef,
  numDotsVisible = 7,
}: Params) {
  const [chartDimensions, setChartDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const { state: transformState } = useChartTransformState();

  const xPan = useSharedValue(0);

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

        console.log(translateX, fixedTranslate);

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

  useLayoutEffect(() => {
    chartRef.current?.measureInWindow((x, y, width, height) => {
      setChartDimensions({ x, y, width, height });
    });
  }, []);

  return {
    chartConfig: {
      transformState,
      viewport: {
        x: [data.length - numDotsVisible, data.length - 1] as [number, number],
      },
    },
  };
}
