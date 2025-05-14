import { z } from "zod";

export const TrackerStateSchema = z.object({
  type: z.enum(["timer", "stopwatch"]),
  status: z.enum(["inactive", "running", "paused", "completed"]),
  remainingTime: z.number(),
  time: z.number(),
  sessionId: z.string(),
});

export type TrackerState = z.infer<typeof TrackerStateSchema>;
