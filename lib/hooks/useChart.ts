import { Dimensions } from "react-native";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  getTransformComponents,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";

interface Params {
  data: any[]; // TODO
  initialPressState: { x: any; y: any };
  numDotsVisible?: number;
  width?: number;
  margin?: number;
}

export default function useChart({
  data,
  initialPressState,
  numDotsVisible = 7,
  width = Dimensions.get("window").width,
  margin = 16,
}: Params) {
  const { state: pressState, isActive } = useChartPressState(initialPressState);

  const { state: transformState } = useChartTransformState();

  const xPan = useSharedValue(0);

  const effectiveWidth = width - margin * 2;
  const interval = effectiveWidth / numDotsVisible;

  useAnimatedReaction(
    () => transformState.panActive.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const { translateX } = getTransformComponents(
          transformState.matrix.value,
        );

        xPan.value = translateX;

        const minPan = 0;
        const maxPan = interval * (data.length - numDotsVisible - 1);

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

  return {
    isActive,
    xPan,
    chartConfig: {
      pressState,
      transformState,
      viewport: {
        x: [data.length - numDotsVisible - 1, data.length - 1] as [
          number,
          number,
        ],
      },
      chartPressConfig: {
        pan: {
          activateAfterLongPress: 150,
        },
      },
      transformConfig: {
        pan: { dimensions: "x" },
        pinch: { enabled: false },
      },
    } as const,
  };
}
