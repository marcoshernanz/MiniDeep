import { z } from "zod";

export const TimerStateSchema = z.object({
  status: z.enum(["inactive", "running", "paused", "completed"]),
  remainingTime: z.number(),
  date: z.date(),
  sessionId: z.string(),
});

export type TimerState = z.infer<typeof TimerStateSchema>;
