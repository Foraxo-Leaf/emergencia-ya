import db from "../db";
import { app } from "../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export async function syncProtocols() {
  try {
    const firestore = getFirestore(app);
    const snapshot = await getDocs(collection(firestore, "protocols"));
    const protocols = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    await db.protocols.bulkPut(protocols);
  } catch (error) {
    console.error("Failed to sync protocols", error);
  }
}

export async function getProtocols() {
  const local = await db.protocols.toArray();
  if (typeof navigator !== "undefined" && navigator.onLine) syncProtocols();
  return local;
}
