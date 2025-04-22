import { z } from "zod";

export const TimeEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  action: z.enum(["start", "stop"]),
  date: z.date(),
});

export type TimeEvent = z.infer<typeof TimeEventSchema>;
