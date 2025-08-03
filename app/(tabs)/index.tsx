import DeepWorkActive from "@/components/deepWork/DeepWorkActive";
import DeepWorkStopwatch from "@/components/deepWork/DeepWorkStopwatch";
import DeepWorkTimer from "@/components/deepWork/DeepWorkTimer";
import { useAppContext } from "@/context/AppContext";
import { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

export default function IndexScreen() {
  const { appData } = useAppContext();

  const active = useMemo(() => {
    const sessions = appData.sessions;
    if (sessions.length === 0) {
      return null;
    }

    const latestSession = sessions[sessions.length - 1];
    if (latestSession.status !== "finished") {
      return latestSession.type;
    }

    return null;
  }, [appData.sessions]);

  if (active) {
    return <DeepWorkActive type={active} />;
  }

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
