import { z } from "zod";

export const StopwatchSessionSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  type: z.literal("stopwatch"),
  status: z.union([
    z.literal("running"),
    z.literal("paused"),
    z.literal("finished"),
  ]),
  intervals: z.array(
    z.object({
      start: z.coerce.date(),
      end: z.coerce.date().nullable(),
    })
  ),
});

export type StopwatchSession = z.infer<typeof StopwatchSessionSchema>;
