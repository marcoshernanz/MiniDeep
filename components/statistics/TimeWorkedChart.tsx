import useColors from "@/lib/hooks/useColors";
import { LinearGradient } from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Area, CartesianChart, Line, Scatter } from "victory-native";
import { useMemo } from "react";
import { ReText } from "react-native-redash";
import formatTime from "@/lib/utils/formatTime";
import { format, parseISO } from "date-fns";
import { Text } from "../ui/Text";
import { useStatisticsContext } from "@/context/StatisticsContext";

type DataType = {
  x: string;
  y: Record<"time", number>;
};

export default function TimeWorkedChart() {
  const {
    statisticsData,
    chart: { chartRef, chartConfig, tooltip },
  } = useStatisticsContext();
  const { getColor } = useColors();
  const { width } = Dimensions.get("window");

  const formattedDates = useMemo(
    () =>
      statisticsData.reduce((acc, item) => {
        acc[item.date] = format(parseISO(item.date), "MMM dd, yyyy");
        return acc;
      }, {} as Record<string, string>),
    [statisticsData]
  );

  const date = useDerivedValue(() => formattedDates[tooltip.x.value.value]);
  const time = useDerivedValue(() => formatTime(tooltip.y.value.value / 1000));

  const lineStyle = useAnimatedStyle(() => ({
    width: 1,
    transform: [
      {
        translateX: tooltip.x.position.value - 0.5,
      },
    ],
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    width: 100,
    transform: [
      {
        translateX: Math.min(
          width - 100,
          Math.max(0, tooltip.x.position.value - 50)
        ),
      },
    ],
  }));

  if (statisticsData.length < 2) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-muted-foreground">Not enough data</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View
        ref={chartRef}
        shouldRasterizeIOS
        renderToHardwareTextureAndroid
        className="flex-1"
      >
        <CartesianChart
          data={statisticsData}
          xKey="date"
          yKeys={["time"]}
          xAxis={{ lineWidth: 0, labelPosition: "inset" }}
          yAxis={[{ lineWidth: 0, labelPosition: "inset" }]}
          padding={{ top: 64 }}
          {...chartConfig}
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
              <Scatter
                points={points.time}
                radius={6}
                style="stroke"
                color={getColor("primary")}
                strokeWidth={2}
              />
              <Scatter
                points={points.time}
                radius={6}
                style="fill"
                color={getColor("background")}
              />
            </>
          )}
        </CartesianChart>

        {tooltip.isActive && (
          <>
            <View className="absolute -z-10 h-full">
              <Animated.View
                className="mt-16 flex-1 bg-primary"
                style={lineStyle}
              ></Animated.View>
            </View>

            <Animated.View
              className="absolute h-16 justify-center rounded-md border border-primary bg-primary/20 px-3"
              style={tooltipStyle}
            >
              <ReText
                text={time}
                className="text-lg font-bold"
                style={{ color: getColor("foreground") }}
              />
              <ReText
                text={date}
                className="text-sm"
                style={{ color: getColor("foreground") }}
              />
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}
