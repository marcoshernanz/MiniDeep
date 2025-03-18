import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import { CartesianChart, Area, Line, useChartPressState } from "victory-native";
import {
  Circle,
  LinearGradient,
  listFontFamilies,
  matchFont,
} from "@shopify/react-native-skia";
import useColors from "@/lib/hooks/useColors";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface Props {
  sessions: ActivityType["sessions"];
}

const DATA = [
  { duration: 0, hour: 0 },
  { duration: 0, hour: 1 },
  { duration: 0, hour: 2 },
  { duration: 0, hour: 3 },
  { duration: 0, hour: 4 },
  { duration: 30, hour: 5 },
  { duration: 60, hour: 6 },
  { duration: 60, hour: 7 },
  { duration: 30, hour: 8 },
  { duration: 0, hour: 9 },
  { duration: 0, hour: 10 },
  { duration: 0, hour: 11 },
  { duration: 0, hour: 12 },
  { duration: 20, hour: 13 },
  { duration: 60, hour: 14 },
  { duration: 40, hour: 15 },
  { duration: 0, hour: 16 },
  { duration: 0, hour: 17 },
  { duration: 0, hour: 18 },
  { duration: 0, hour: 19 },
  { duration: 0, hour: 20 },
  { duration: 0, hour: 21 },
  { duration: 0, hour: 22 },
  { duration: 0, hour: 23 },
];

const circleSize = 12;

export default function WorkDistributionChart({ sessions }: Props) {
  const { getColor } = useColors();
  const font = matchFont({ fontFamily: listFontFamilies()[0] });
  const { state, isActive } = useChartPressState({ x: 0, y: { duration: 0 } });

  const lineStyle = useAnimatedStyle(() => ({
    width: 1,
    transform: [{ translateX: state.x.position.value - 0.5 }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    height: circleSize,
    width: circleSize,
    transform: [
      { translateX: state.x.position.value - circleSize / 2 },
      { translateY: state.y.duration.position.value - circleSize / 2 },
    ],
  }));

  return (
    <Card className="mx-4 p-4">
      <Text className="mb-2 text-xl font-medium text-foreground">
        Daily Work Distribution
      </Text>
      <View className="h-72">
        <CartesianChart
          data={DATA}
          xKey="hour"
          yKeys={["duration"]}
          domain={{ x: [0, 23], y: [-1, 61] }}
          padding={{ bottom: 12, top: 40 }}
          xAxis={{
            font,
            lineWidth: 0,
            tickValues: [4, 9, 14, 19],
            labelOffset: 5,
            lineColor: getColor("mutedForeground"),
            labelColor: getColor("mutedForeground"),
            formatXLabel: (x) => (x < 10 ? `0${x}:00` : `${x}:00`),
          }}
          yAxis={[{ lineWidth: 0 }]}
          chartPressState={state}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                points={points.duration}
                color={getColor("primary")}
                strokeWidth={1}
                curveType="natural"
              />
              <Area
                points={points.duration}
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
          </>
        )}
      </View>
    </Card>
  );
}
