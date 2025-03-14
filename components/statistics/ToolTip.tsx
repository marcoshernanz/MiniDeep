import { Circle } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

interface Props {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export default function ToolTip({ x, y }: Props) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}
