import useColors from "@/lib/hooks/useColors";
import useChart from "@/lib/hooks/useChart";
import { LinearGradient } from "@shopify/react-native-skia";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { Area, CartesianChart, Line, Scatter } from "victory-native";
import formatTime from "@/lib/utils/formatTime";
import { useRef } from "react";

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
  { date: "2023-10-15", time: 21600 },
  { date: "2023-10-16", time: 28800 },
  { date: "2023-10-17", time: 3600 },
  { date: "2023-10-18", time: 18000 },
  { date: "2023-10-19", time: 7200 },
  { date: "2023-10-20", time: 10800 },
  { date: "2023-10-21", time: 25200 },
  { date: "2023-10-22", time: 14400 },
  { date: "2023-10-23", time: 21600 },
  { date: "2023-10-24", time: 28800 },
  { date: "2023-10-25", time: 3600 },
  { date: "2023-10-26", time: 18000 },
  { date: "2023-10-27", time: 7200 },
  { date: "2023-10-28", time: 10800 },
  { date: "2023-10-29", time: 25200 },
  { date: "2023-10-30", time: 14400 },
];

const margin = 16;

export default function TimeWorkedChart() {
  const { getColor } = useColors();
  const chartRef = useRef(null);

  const { chartConfig } = useChart({
    data,
    chartRef,
  });

  return (
    <View
      className="flex-1"
      style={{
        marginHorizontal: margin,
      }}
    >
      <View ref={chartRef} className="flex-1">
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={["time"]}
          domain={{ y: [0], x: [0, data.length - 1] }}
          xAxis={{ lineWidth: 0, labelPosition: "inset" }}
          yAxis={[{ lineWidth: 0, labelPosition: "inset" }]}
          transformConfig={{ pan: { enabled: true, dimensions: ["x"] } }}
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
      </View>
    </View>
  );
}
