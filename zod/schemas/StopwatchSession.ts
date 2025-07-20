import { z } from "zod";

export const StopwatchSession = z.object({
  id: z.string(),
  createdAt: z.date(),
  type: z.literal("stopwatch"),
  intervals: z.array(
    z.object({
      start: z.date(),
      end: z.date().nullable(),
    })
  ),
});

export type StopwatchSession = z.infer<typeof StopwatchSession>;
