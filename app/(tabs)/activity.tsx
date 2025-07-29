import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import useActivity from "@/lib/hooks/useActivity";

export default function ActivityScreen() {
  const data = useActivity();

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeArea style={styles.safeArea} edges={["top"]}>
      <Title style={styles.title}>Activity</Title>
      <FlatList
        data={data}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={({ date }) => date.toDateString()}
        initialScrollIndex={data.length - 1}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item }) => (
          <ActivityItem key={item.date.toDateString()} item={item} />
        )}
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 0,
  },
  title: {
    paddingHorizontal: 16,
  },
});
