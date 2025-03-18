import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { ActivityType } from "@/lib/hooks/useActivity";
import { Card } from "../ui/card";
import { CartesianChart, Area, Line } from "victory-native";
import { LinearGradient, matchFont } from "@shopify/react-native-skia";
import useColors from "@/lib/hooks/useColors";

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

export default function WorkDistributionChart({ sessions }: Props) {
  const { getColor } = useColors();
  const font = matchFont();

  return (
    <Card className="mx-4 bg-white p-4">
      <Text className="mb-2 text-lg font-medium text-foreground">
        Daily Work Distribution
      </Text>
      <View className="h-64">
        <CartesianChart
          data={DATA}
          xKey="hour"
          yKeys={["duration"]}
          domain={{ y: [-1, 61] }}
          // xAxis={{ font, lineWidth: 0 }}
          // yAxis={[{ lineWidth: 0 }]}
          xAxis={{ font, labelColor: "#000" }}
          yAxis={[{ labelColor: "#000" }]}
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
      </View>
    </Card>
  );
}
