import { z } from "zod";
import { TimeEventSchema } from "./TimeEventSchema";

export const WorkSessionSchema = z.object({
  id: z.string(),
  type: z.enum(["timer", "stopwatch"]),
  startDate: z.coerce.date(),
  plannedDuration: z.number(),
  isActive: z.boolean(),
  events: z.array(TimeEventSchema),
});

export type WorkSession = z.infer<typeof WorkSessionSchema>;
