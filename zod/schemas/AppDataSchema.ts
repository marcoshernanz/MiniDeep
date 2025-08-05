import { z } from "zod";
import { WorkSessionSchema } from "./WorkSessionSchema";
import { StateSchema } from "./StateSchema";

export const AppDataSchema = z
  .object({
    sessions: WorkSessionSchema.array(),
    state: StateSchema,
  })
  .strict()
  .default({ sessions: [], state: StateSchema.parse(undefined) });

export type AppData = z.infer<typeof AppDataSchema>;
