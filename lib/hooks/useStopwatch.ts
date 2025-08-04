import { useAppContext } from "@/context/AppContext";
import { useMemo, useState, useEffect, useCallback } from "react";
import uuid from "../utils/uuidv4";
import type { StopwatchSession } from "@/zod/schemas/StopwatchSessionSchema";
import calculateSessionDuration from "../sessions/calculateSessionDuration";

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

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => setNow(Date.now()), 200);
      return () => clearInterval(interval);
    }
  }, [status]);

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
