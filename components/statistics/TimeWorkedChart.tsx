import useColors from "@/lib/hooks/useColors";
import { LinearGradient } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import {
  Area,
  CartesianChart,
  Line,
  useChartPressState,
  useChartTransformState,
} from "victory-native";

const data = [
  { date: "2023-10-01", time: 3600 },
  { date: "2023-10-02", time: 18000 },
  { date: "2023-10-03", time: 10800 },
  { date: "2023-10-04", time: 25200 },
  { date: "2023-10-05", time: 7200 },
  { date: "2023-10-06", time: 28800 },
  { date: "2023-10-07", time: 14400 },
  { date: "2023-10-08", time: 21600 },
  { date: "2023-10-09", time: 3600 },
  { date: "2023-10-10", time: 18000 },
  { date: "2023-10-11", time: 25200 },
  { date: "2023-10-12", time: 7200 },
  { date: "2023-10-13", time: 10800 },
  { date: "2023-10-14", time: 14400 },
];

const circleSize = 12;

export default function TimeWorkedChart() {
  const { getColor } = useColors();
  const { state: pressState, isActive } = useChartPressState({
    x: "2023-10-01",
    y: { time: 0 },
  });
  const { state: transformState } = useChartTransformState();

  const { width } = Dimensions.get("window");

  const date = useDerivedValue(() => pressState.x.value.value);
  const time = useDerivedValue(() => String(pressState.y.time.value.value));

  const lineStyle = useAnimatedStyle(() => ({
    width: 1,
    transform: [{ translateX: pressState.x.position.value - 0.5 }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    height: circleSize,
    width: circleSize,
    transform: [
      { translateX: pressState.x.position.value - circleSize / 2 },
      { translateY: pressState.y.time.position.value - circleSize / 2 },
    ],
  }));
  const tooltipStyle = useAnimatedStyle(() => ({
    width: 100,
    transform: [
      {
        translateX: Math.min(
          width - 158,
          Math.max(0, pressState.x.position.value - 50),
        ),
      },
    ],
  }));

  return (
    <View className="flex-1">
      <CartesianChart
        data={data}
        xKey="date"
        yKeys={["time"]}
        domain={{ y: [0] }}
        viewport={{ x: [0, 6] }}
        chartPressState={pressState}
        chartPressConfig={{
          pan: {
            activateAfterLongPress: 150,
          },
        }}
        transformState={transformState}
        transformConfig={{
          pan: { dimensions: "x" },
          pinch: { enabled: false },
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Line
              points={points.time}
              color={getColor("primary")}
              strokeWidth={1}
              curveType="natural"
            />
            <Area
              points={points.time}
              y0={chartBounds.bottom}
              curveType="natural"
              opacity={0.5}
            >
              <LinearGradient
                start={{ x: 0, y: chartBounds.top }}
                end={{ x: 0, y: chartBounds.bottom }}
                colors={[getColor("primary"), getColor("primary", 0.3)]}
              />
            </Area>
          </>
        )}
      </CartesianChart>

      {isActive && (
        <>
          <View className="absolute h-full">
            <Animated.View
              className="mb-6 mt-9 flex-1 bg-primary"
              style={lineStyle}
            ></Animated.View>
          </View>
          <Animated.View
            className="absolute rounded-full bg-primary"
            style={circleStyle}
          ></Animated.View>

          <Animated.View
            className="absolute h-9 flex-row items-center justify-center rounded-md border border-primary bg-primary/20"
            style={tooltipStyle}
          >
            <ReText text={time} style={{ color: getColor("foreground") }} />
            <ReText
              text={date}
              style={{ color: getColor("foreground"), fontWeight: 600 }}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
}
