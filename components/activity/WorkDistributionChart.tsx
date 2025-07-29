import React from "react";
import { Dimensions, View } from "react-native";
import { Text } from "../ui/Text";
import { Card } from "../ui/card";
import { CartesianChart, Area, Line, useChartPressState } from "victory-native";
import {
  LinearGradient,
  listFontFamilies,
  matchFont,
} from "@shopify/react-native-skia";
import useColors from "@/lib/hooks/useColors";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { ActivityType } from "@/context/ActivityContext";

interface Props {
  timeDistribution: ActivityType["timeDistribution"];
}

const formatHour = (hour: number) => {
  if (hour < 10) {
    return `0${hour}:00`;
  } else {
    return `${hour}:00`;
  }
};

const circleSize = 12;

export default function WorkDistributionChart({ timeDistribution }: Props) {
  const { getColor } = useColors();
  const font = matchFont({ fontFamily: listFontFamilies()[0] });
  const { state, isActive } = useChartPressState({ x: 0, y: { time: 0 } });

  const { width } = Dimensions.get("window");

  const time = useDerivedValue(() =>
    state.x.value.value < 10
      ? `0${state.x.value.value}:00`
      : `${state.x.value.value}:00`
  );
  const duration = useDerivedValue(() =>
    String(Math.round(state.y.time.value.value / (60 * 1000)))
  );

  const lineStyle = useAnimatedStyle(() => ({
    width: 1,
    transform: [{ translateX: state.x.position.value - 0.5 }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    height: circleSize,
    width: circleSize,
    transform: [
      { translateX: state.x.position.value - circleSize / 2 },
      { translateY: state.y.time.position.value - circleSize / 2 },
    ],
  }));
  const tooltipStyle = useAnimatedStyle(() => ({
    width: 100,
    transform: [
      {
        translateX: Math.min(
          width - 158,
          Math.max(0, state.x.position.value - 50)
        ),
      },
    ],
  }));

  return (
    <Card className="mx-4 p-4">
      <Text className="mb-2 text-xl font-medium text-foreground">
        Daily Work Distribution
      </Text>
      <View className="h-72">
        <CartesianChart
          data={timeDistribution}
          xKey="hour"
          yKeys={["time"]}
          domain={{ x: [0, 23], y: [-1, 61 * 60 * 1000] }}
          padding={{ bottom: 12, top: 32 }}
          xAxis={{
            font,
            lineWidth: 0,
            tickValues: [4, 9, 14, 19],
            labelOffset: 5,
            lineColor: getColor("mutedForeground"),
            labelColor: getColor("mutedForeground"),
            formatXLabel: formatHour,
          }}
          yAxis={[{ lineWidth: 0, labelPosition: "inset" }]}
          chartPressState={state}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                points={points.time}
                color={getColor("primary")}
                strokeWidth={1}
                curveType="bumpX"
              />
              <Area
                points={points.time}
                y0={chartBounds.bottom}
                curveType="bumpX"
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
              <Text className="mx-1 font-bold">&bull;</Text>
              <ReText
                text={duration}
                style={{ color: getColor("foreground"), fontWeight: 600 }}
              />
              <Text className="text-sm">min</Text>
            </Animated.View>
          </>
        )}
      </View>
    </Card>
  );
}
