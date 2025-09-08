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

export async function sync() {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  const firestore = getFirestore(app);
  const pending = await db.outbox.toArray();

  for (const item of pending) {
    try {
      await setDoc(doc(firestore, item.type, item.payload.id), {
        ...item.payload,
        updated_at: Date.now(),
      });
      await db.outbox.delete(item.id);
    } catch (error) {
      console.error("Failed to process outbox item", error);
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

  const now = Date.now();

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

