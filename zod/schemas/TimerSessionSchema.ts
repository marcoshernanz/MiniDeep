import { z } from "zod";

export const TimerSessionSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  type: z.literal("timer"),
  inputDuration: z.number(),
  events: z.array(
    z.object({
      start: z.coerce.date(),
      stop: z.coerce.date().nullable(),
    })
  ),
});

export type TimerSession = z.infer<typeof TimerSessionSchema>;
