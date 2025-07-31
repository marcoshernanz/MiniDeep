import { z } from "zod";

export const TimerSessionSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  type: z.literal("timer"),
  status: z.union([
    z.literal("running"),
    z.literal("paused"),
    z.literal("finished"),
  ]),
  inputDuration: z.number(),
  events: z.array(
    z.object({
      start: z.coerce.date(),
      stop: z.coerce.date().nullable(),
    })
  ),
});

export type TimerSession = z.infer<typeof TimerSessionSchema>;
