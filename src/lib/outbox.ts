import { db } from "@/lib/db";

type OutboxPayload = unknown;

export const enqueue = (type: string, payload: OutboxPayload) =>
  db.outbox.add({ type, payload, created_at: Date.now() });
