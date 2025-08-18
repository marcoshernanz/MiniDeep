import DeepWorkActive from "@/components/deepWork/DeepWorkActive";
import DeepWorkStopwatch from "@/components/deepWork/DeepWorkStopwatch";
import DeepWorkTimer from "@/components/deepWork/DeepWorkTimer";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/utils/getColor";
import { useMemo, useRef, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from "react-native-reanimated";

import notifee, { TriggerType } from "@notifee/react-native";

export default function IndexScreen() {
  const notification = async () => {
    try {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        sound: "timer_done",
      });

      await notifee.createTriggerNotification(
        {
          title: "Title",
          body: "Body",
          android: {
            channelId,
            sound: "timer_done",
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: Date.now() + 1000,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button onPress={notification} containerStyle={{ marginTop: 200 }}>
      Start
    </Button>
  );

  // const { appData, setAppData } = useAppContext();
  // const scrollRef = useRef<any>(null);

  // const mode = appData.state.mode;

  // const scrollX = useSharedValue(0);
  // const screenWidth = Dimensions.get("screen").width;
  // const scrollHandler = useAnimatedScrollHandler((event) => {
  //   scrollX.value = event.contentOffset.x;
  // });

  // const dotStyleTimer = useAnimatedStyle(() => {
  //   const inputRange = [-screenWidth, 0, screenWidth];
  //   const backgroundColor = interpolateColor(scrollX.value, inputRange, [
  //     getColor("muted"),
  //     getColor("primary"),
  //     getColor("muted"),
  //   ]);
  //   const opacity = interpolate(
  //     scrollX.value,
  //     inputRange,
  //     [0.5, 1, 0.5],
  //     Extrapolation.CLAMP
  //   );
  //   return { backgroundColor, opacity };
  // });

  // const dotStyleStopwatch = useAnimatedStyle(() => {
  //   const inputRange = [0, screenWidth, 2 * screenWidth];
  //   const backgroundColor = interpolateColor(scrollX.value, inputRange, [
  //     getColor("muted"),
  //     getColor("primary"),
  //     getColor("muted"),
  //   ]);
  //   const opacity = interpolate(
  //     scrollX.value,
  //     inputRange,
  //     [0.5, 1, 0.5],
  //     Extrapolation.CLAMP
  //   );
  //   return { backgroundColor, opacity };
  // });

  // const active = useMemo(() => {
  //   const sessions = appData.sessions;
  //   if (sessions.length === 0) {
  //     return null;
  //   }

  //   const latestSession = sessions[sessions.length - 1];
  //   if (latestSession.status !== "finished") {
  //     return latestSession.type;
  //   }

  //   return null;
  // }, [appData.sessions]);

  // useEffect(() => {
  //   const index = mode === "timer" ? 0 : 1;
  //   const width = Dimensions.get("screen").width;
  //   scrollRef.current?.scrollTo({ x: index * width, animated: false });
  // }, [mode]);

  // useEffect(() => {
  //   if (!active) {
  //     const index = mode === "timer" ? 0 : 1;
  //     scrollX.value = index * screenWidth;
  //   }
  // }, [active, mode, screenWidth, scrollX]);

  // if (active) {
  //   return <DeepWorkActive type={active} />;
  // }

  // return (
  //   <View style={styles.container}>
  //     <Animated.ScrollView
  //       ref={scrollRef}
  //       horizontal
  //       pagingEnabled
  //       showsHorizontalScrollIndicator={false}
  //       overScrollMode="never"
  //       bounces={false}
  //       contentOffset={{ x: mode === "timer" ? 0 : screenWidth, y: 0 }}
  //       onScroll={scrollHandler}
  //       scrollEventThrottle={16}
  //       onMomentumScrollEnd={(e) => {
  //         const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
  //         const newMode = page === 0 ? "timer" : "stopwatch";
  //         if (newMode !== appData.state.mode) {
  //           setAppData((prev) => ({
  //             ...prev,
  //             state: { ...prev.state, mode: newMode },
  //           }));
  //         }
  //       }}
  //     >
  //       <DeepWorkTimer />
  //       <DeepWorkStopwatch />
  //     </Animated.ScrollView>

  //     <View style={styles.dotsContainer}>
  //       <Animated.View style={[styles.dot, dotStyleTimer]} />
  //       <Animated.View style={[styles.dot, dotStyleStopwatch]} />
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: Dimensions.get("screen").width,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 72,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    backgroundColor: getColor("muted"),
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
