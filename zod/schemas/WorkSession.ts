import { z } from "zod";
import { StopwatchSession } from "./StopwatchSession";
import { TimerSession } from "./TimerSession";

export const WorkSession = z.discriminatedUnion("type", [
  StopwatchSession,
  TimerSession,
]);

export type WorkSession = z.infer<typeof WorkSession>;
