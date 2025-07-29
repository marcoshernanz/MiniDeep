import { Dimensions, StyleSheet, View } from "react-native";
import { format } from "date-fns";
import Text from "../ui/Text";
import SimpleChart from "../ui/SimpleChart";
import useHourlyWorkDistribution from "@/lib/hooks/statistics/useHourlyWorkDistribution";

interface Props {
  date: Date;
}
export default function ActivityWorkDistribution({ date }: Props) {
  const workDistribution = useHourlyWorkDistribution();

  const dayKey = format(date, "yyyy-MM-dd");
  const chartData = workDistribution[dayKey] ?? {};

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Work Distribution</Text>

        <SimpleChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={250}
          pointsPerLabel={6}
          labelStart={3}
          maxValue={1000 * 60 * 60}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 12,
  },
});
