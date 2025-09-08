import db from "../db";
import { app } from "../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export async function syncContacts() {
  try {
    const firestore = getFirestore(app);
    const snapshot = await getDocs(collection(firestore, "contacts"));
    const contacts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    await db.contacts.bulkPut(contacts);
  } catch (error) {
    console.error("Failed to sync contacts", error);
  }
}

export async function getContacts() {
  const local = await db.contacts.toArray();
  if (typeof navigator !== "undefined" && navigator.onLine) syncContacts();
  return local;
}
