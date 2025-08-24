import { ActivityEntry } from "@/lib/hooks/useActivity";
import { format } from "date-fns";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import Description from "../ui/Description";
import ActivitySessionItem from "./ActivitySessionItem";
import ActivityOverview from "./ActivityOverview";
import ActivityWorkDistribution from "./ActivityWorkDistribution";
import Text from "../ui/Text";

interface Props {
  item: ActivityEntry;
}

export default function ActivityItem({ item }: Props) {
  return (
    <View style={styles.container}>
      <Description style={styles.description}>
        {format(item.date, "MMMM dd, yyyy")}
      </Description>

      <FlatList
        data={item.sessions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={{ paddingHorizontal: 16 }}>
            <ActivityOverview
              totalTime={item.totalTime}
              totalSessions={item.totalSessions}
            />
            <ActivityWorkDistribution date={item.date} />
            <Text style={styles.sessionsTitle}>Sessions</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => <ActivitySessionItem session={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
  },
  description: {
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sessionsTitle: {
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 12,
  },
});
