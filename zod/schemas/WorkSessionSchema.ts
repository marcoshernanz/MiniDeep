import { z } from "zod";
import { StopwatchSessionSchema } from "./StopwatchSessionSchema";
import { TimerSessionSchema } from "./TimerSessionSchema";

export const WorkSessionSchema = z.discriminatedUnion("type", [
  StopwatchSessionSchema,
  TimerSessionSchema,
]);

export type WorkSession = z.infer<typeof WorkSessionSchema>;
