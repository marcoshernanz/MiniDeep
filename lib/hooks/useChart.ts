import { RefObject } from "react";
import { View } from "react-native";

interface Params {
  data: any[];
  chartRef: RefObject<View>;
  numDotsVisible?: number;
}

export default function useChart({
  data,
  chartRef,
  numDotsVisible = 7,
}: Params) {
  return {};
}
