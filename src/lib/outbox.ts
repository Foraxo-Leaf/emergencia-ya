import { db } from "@/lib/db";

export const enqueue = (type: string, payload: any) =>
  db.outbox.add({ type, payload, created_at: Date.now() });
