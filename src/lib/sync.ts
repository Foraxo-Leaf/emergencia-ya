import { db } from "./db";
import { app } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
  setDoc,
} from "firebase/firestore";

const LAST_SYNC_KEY = "lastSync";
const MAX_OUTBOX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 30_000; // 30s
const MAX_BACKOFF_MS = 15 * 60 * 1000; // 15m

export async function sync() {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  const firestore = getFirestore(app);
  const now = Date.now();
  const pending = await db.outbox
    .filter((item) => (item.nextAttemptAt ?? 0) <= now)
    .sortBy("created_at");

  for (const item of pending) {
    try {
      const payloadId = (item as {payload?: {id?: string}}).payload?.id ?? String(item.id);
      await setDoc(doc(firestore, item.type, payloadId), {
        ...item.payload,
        updated_at: Date.now(),
      });
      await db.outbox.delete(item.id);
    } catch (error) {
      console.error("Failed to process outbox item", error);
      const attempts = (item.attempts ?? 0) + 1;
      const backoff = Math.min(
        MAX_BACKOFF_MS,
        BASE_BACKOFF_MS * 2 ** Math.max(0, attempts - 1),
      );

      if (attempts >= MAX_OUTBOX_ATTEMPTS) {
        console.warn(`Outbox item ${item.id} reached max attempts; keeping for manual retry.`);
      }

      await db.outbox.update(item.id, {
        attempts,
        nextAttemptAt: now + backoff,
      });
    }
  }

  let lastSync = 0;
  if (typeof window !== "undefined") {
    lastSync = Number(localStorage.getItem(LAST_SYNC_KEY)) || 0;
  }

  const collections = [
    { name: "contacts", store: db.contacts },
    { name: "protocols", store: db.protocols },
    { name: "incidents", store: db.incidents },
    { name: "attachments", store: db.attachments },
  ];

  for (const { name, store } of collections) {
    try {
      const q = query(
        collection(firestore, name),
        where("updated_at", ">", lastSync)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      if (docs.length) await store.bulkPut(docs);
    } catch (error) {
      console.error(`Failed to sync ${name}`, error);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_SYNC_KEY, String(now));
  }
}

