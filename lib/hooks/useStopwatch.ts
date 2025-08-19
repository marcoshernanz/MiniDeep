import { useAppContext } from "@/context/AppContext";
import { useMemo, useState, useEffect, useCallback } from "react";
import uuid from "../utils/uuidv4";
import type { StopwatchSession } from "@/zod/schemas/StopwatchSessionSchema";
import calculateSessionDuration from "../sessions/calculateSessionDuration";
import notifee from "@notifee/react-native";
import extractTime from "../utils/extractTime";

export default function useStopwatch() {
  const { appData, setAppData } = useAppContext();
  const [now, setNow] = useState(Date.now());

  const { status, timeElapsed } = useMemo(() => {
    const swSessions = appData.sessions.filter((s) => s.type === "stopwatch");
    if (swSessions.length === 0) {
      return { status: "finished" as const, timeElapsed: 0 };
    }
    const latest = swSessions[swSessions.length - 1] as StopwatchSession;
    const status = latest.status;
    const elapsed = calculateSessionDuration(latest, now);
    return { status, timeElapsed: elapsed };
  }, [appData.sessions, now]);

  const { hours, minutes, seconds } = useMemo(
    () => extractTime(timeElapsed),
    [timeElapsed]
  );

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => setNow(Date.now()), 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    (async () => {
      const channelId = await notifee.createChannel({
        id: "stopwatch",
        name: "Stopwatch",
      });

      const titleFormat = (n: number) => n.toString().padStart(2, "0");
      const title = [hours, minutes, seconds]
        .slice(hours > 0 ? 0 : 1)
        .map(titleFormat)
        .join(":");
      const body = status === "running" ? "Stopwatch" : "Stopwatch Paused";

      await notifee.displayNotification({
        id: "stopwatch",
        title,
        body,
        android: {
          channelId,
          asForegroundService: true,
          ongoing: true,
        },
      });
    })();
  }, [hours, minutes, seconds, status]);

  const start = useCallback(() => {
    if (status !== "finished") return;
    const nowDate = new Date();
    const newSession: StopwatchSession = {
      id: uuid(),
      createdAt: nowDate,
      type: "stopwatch",
      status: "running",
      intervals: [{ start: nowDate, end: null }],
    };
    setAppData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
    }));
    setNow(nowDate.getTime());
  }, [status, setAppData]);

  const togglePause = useCallback(() => {
    const sessions = appData.sessions;
    if (sessions.length === 0) return;

    const session = sessions[sessions.length - 1];
    if (session.type !== "stopwatch") return;

    const nowDate = new Date();

    if (session.status === "running") {
      const updatedIntervals = session.intervals.map((intv, i) =>
        i === session.intervals.length - 1 ? { ...intv, end: nowDate } : intv
      );
      setAppData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s, i) =>
          i === sessions.length - 1
            ? { ...session, status: "paused", intervals: updatedIntervals }
            : s
        ),
      }));

      setNow(nowDate.getTime());
    } else if (session.status === "paused") {
      const newInterval = { start: nowDate, end: null };
      setAppData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s, i) =>
          i === sessions.length - 1
            ? {
                ...session,
                status: "running",
                intervals: [...session.intervals, newInterval],
              }
            : s
        ),
      }));

      setNow(nowDate.getTime());
    }
  }, [appData.sessions, setAppData]);

  const stop = useCallback(() => {
    const sessions = appData.sessions;
    if (sessions.length === 0) return;
    const session = sessions[sessions.length - 1];
    if (session.type !== "stopwatch") return;
    const nowDate = new Date();
    let updatedIntervals = session.intervals;
    if (session.status === "running") {
      updatedIntervals = session.intervals.map((intv, i) =>
        i === session.intervals.length - 1 ? { ...intv, end: nowDate } : intv
      );
    }
    setAppData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s, i) =>
        i === sessions.length - 1
          ? { ...session, status: "finished", intervals: updatedIntervals }
          : s
      ),
    }));
    setNow(nowDate.getTime());
  }, [appData.sessions, setAppData]);

  return { status, timeElapsed, start, togglePause, stop };
}
