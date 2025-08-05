import { z } from "zod";

export const StateSchema = z
  .object({
    timer: z
      .object({
        hours: z.number().min(0).max(23).default(0),
        minutes: z.number().min(0).max(59).default(30),
      })
      .strict(),
    mode: z.enum(["timer", "stopwatch"]).default("timer"),
  })
  .strict()
  .default({ timer: { hours: 0, minutes: 30 }, mode: "timer" });

export type State = z.infer<typeof StateSchema>;
