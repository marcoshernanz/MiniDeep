import { z } from "zod";

export const TimerSession = z.object({
  id: z.string(),
  createdAt: z.date(),
  type: z.literal("timer"),
  inputDuration: z.number(),
  events: z.array(
    z.object({
      start: z.date(),
      stop: z.date().nullable(),
    })
  ),
});

export type TimerSession = z.infer<typeof TimerSession>;
