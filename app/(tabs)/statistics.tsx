import Statistics from "@/components/statistics/Statistics";
import StatisticsContextProvider from "@/context/StatisticsContext";

export default function StatisticsScreen() {
  return (
    <StatisticsContextProvider>
      <Statistics />
    </StatisticsContextProvider>
  );
}
