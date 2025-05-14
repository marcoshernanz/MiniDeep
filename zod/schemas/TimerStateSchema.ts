import { z } from "zod";

export const TimerStateSchema = z.object({
  type: z.enum(["timer", "stopwatch"]),
  status: z.enum(["inactive", "running", "paused", "completed"]),
  remainingTime: z.number(),
  time: z.number(),
  sessionId: z.string(),
});

export type TimerState = z.infer<typeof TimerStateSchema>;
