import { useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import ToolTip from "./ToolTip";

interface Props {
  data: any;
}

const mockData = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

export default function StatisticsAreaChart({ data }: Props) {
  const font = useFont(undefined, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });

  return (
    <View className="h-64 bg-yellow-600">
      <CartesianChart
        data={mockData}
        xKey="day"
        yKeys={["highTmp"]}
        chartPressState={state}
        axisOptions={{ font }}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isActive && (
              <ToolTip x={state.x.position} y={state.y.highTmp.position} />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
