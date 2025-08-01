import { WorkSession } from "@/zod/schemas/WorkSessionSchema";

interface Props {
  type: WorkSession["type"];
}

export default function DeepWorkActive({ type }: Props) {
  return null;
}
