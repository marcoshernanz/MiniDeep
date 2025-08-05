import DeepWorkActive from "@/components/deepWork/DeepWorkActive";
import DeepWorkStopwatch from "@/components/deepWork/DeepWorkStopwatch";
import DeepWorkTimer from "@/components/deepWork/DeepWorkTimer";
import { useAppContext } from "@/context/AppContext";
import { useMemo, useRef, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

export default function IndexScreen() {
  const { appData, setAppData } = useAppContext();
  const scrollRef = useRef<any>(null);

  const mode = appData.state.mode;
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

  useEffect(() => {
    const index = mode === "timer" ? 0 : 1;
    const width = Dimensions.get("screen").width;
    scrollRef.current?.scrollTo({ x: index * width, animated: false });
  }, [mode]);

  if (active) {
    return <DeepWorkActive type={active} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const width = Dimensions.get("screen").width;
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          const newMode = page === 0 ? "timer" : "stopwatch";
          if (newMode !== appData.state.mode) {
            setAppData((prev) => ({
              ...prev,
              state: { ...prev.state, mode: newMode },
            }));
          }
        }}
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
