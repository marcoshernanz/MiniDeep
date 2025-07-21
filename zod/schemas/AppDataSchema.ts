import { z } from "zod";
import { WorkSessionSchema } from "./WorkSessionSchema";

export const AppDataSchema = z
  .object({
    sessions: WorkSessionSchema.array(),
  })
  .strict()
  .default({ sessions: [] });

export type AppData = z.infer<typeof AppDataSchema>;
