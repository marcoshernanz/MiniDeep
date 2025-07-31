import DeepWorkStopwatch from "@/components/deepWork/DeepWorkStopwatch";
import DeepWorkTimer from "@/components/deepWork/DeepWorkTimer";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        scrollEventThrottle={16}
      >
        <DeepWorkTimer />
        <DeepWorkStopwatch />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: Dimensions.get("screen").width,
  },
});
