import { z } from "zod";
import { WorkSession } from "./WorkSession";

export const AppDataSchema = z
  .object({
    sessions: WorkSession.array(),
  })
  .strict()
  .default({ sessions: [] });

export type AppData = z.infer<typeof AppDataSchema>;
