import { RefObject, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getTransformComponents,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { ChartPressStateInit } from "victory-native/dist/cartesian/hooks/useChartPressState";

type DataType = Record<string, unknown>;

interface Params<T extends ChartPressStateInit> {
  data: DataType[];
  chartRef: RefObject<View>;
  numDotsVisible: number;
  yKey: string;
  initialState: T;
  paddingX?: number;
  dynamicY?: boolean;
}

export default function useChart<T extends ChartPressStateInit>({
  data,
  chartRef,
  numDotsVisible,
  yKey,
  initialState,
  paddingX = 0,
  dynamicY = false,
}: Params<T>) {
  const [maxY, setMaxY] = useState(
    data.reduce((max, item) => Math.max(max, item[yKey] as number), 0),
  );
  const [chartDimensions, setChartDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const interval =
    (chartDimensions.width - paddingX * 2) / (numDotsVisible - 1);

  const { state: transformState } = useChartTransformState();
  const { isActive, state: pressState } = useChartPressState(initialState);

  const xPan = useSharedValue(0);

  useAnimatedReaction(
    () => transformState.panActive.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const { translateX } = getTransformComponents(
          transformState.matrix.value,
        );

        xPan.value = translateX;

        const maxPan = 0;
        const minPan = -interval * (data.length - numDotsVisible);
        const translate = Math.round(xPan.value / interval) * interval;
        const fixedTranslate =
          Math.max(minPan, Math.min(maxPan, translate)) + paddingX;

        xPan.value = withTiming(fixedTranslate);

        const index = Math.abs(Math.round(fixedTranslate / interval));

        let newMaxY = 0;
        for (
          let i = index;
          i < index + numDotsVisible && i < data.length;
          i++
        ) {
          newMaxY = Math.max(newMaxY, data[i][yKey] as number);
        }

        runOnJS(setMaxY)(newMaxY);
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
    const initialXPan =
      -(chartDimensions.width / (numDotsVisible - 1)) *
      (data.length - numDotsVisible);

    transformState.matrix.value = setTranslate(
      transformState.matrix.value,
      initialXPan,
      0,
    );

    chartRef.current?.measureInWindow((x, y, width, height) => {
      if (
        width > 0 &&
        height > 0 &&
        (chartDimensions.width !== width || chartDimensions.height !== height)
      ) {
        setChartDimensions({ x, y, width, height });
      }
    });
  }, [
    chartRef,
    chartDimensions.width,
    chartDimensions.height,
    numDotsVisible,
    data.length,
    transformState.matrix,
  ]);

  return {
    chartConfig: {
      chartPressState: pressState,
      transformState: transformState,
      transformConfig: {
        pan: { enabled: true, dimensions: ["x" as const] },
        pinch: { enabled: false },
      },
      chartPressConfig: { pan: { activateAfterLongPress: 100 } },
      domain: {
        y: dynamicY
          ? ([-1, maxY] as [number, number])
          : ([-1, Math.max(...data.map((item) => item[yKey] as number))] as [
              number,
              number,
            ]),
      },
      viewport: {
        x: [0, numDotsVisible - 1 + (paddingX * 2) / interval] as [
          number,
          number,
        ],
      },
    },
    tooltip: {
      isActive: isActive,
      x: {
        position: useDerivedValue(
          () =>
            pressState.x.position.value +
            getTransformComponents(transformState.matrix.value).translateX,
        ),
        value: pressState.x.value,
      },
      y: {
        position: useDerivedValue(() => pressState.y[yKey].position.value),
        value: pressState.y[yKey].value,
      },
    },
  };
}
