import Dexie from "dexie";
import { CONTACT_DATA } from "@/lib/config";
import { educationTopics } from "@/lib/data/educationData";

export const db = new Dexie("emergencia");

db.version(1).stores({
  contacts: "id,updated_at,deleted",
  protocols: "id,updated_at,deleted",
  incidents: "id,updated_at,deleted",
  attachments: "id,incidentId,updated_at,deleted",
  outbox: "++id,type,payload,created_at",
});

db.version(2).stores({
  contacts: "id,updated_at,deleted",
  protocols: "id,updated_at,deleted",
  incidents: "id,updated_at,deleted",
  attachments: "id,incidentId,updated_at,deleted",
  outbox: "++id,type,payload,created_at",
  secure: "id",
});

const CONTACT_DATA_ARRAY = [
  { id: "samco", ...CONTACT_DATA.samco },
  { id: "monitoringCenter", ...CONTACT_DATA.monitoringCenter },
  { id: "police", ...CONTACT_DATA.police },
  { id: "firefighters", ...CONTACT_DATA.firefighters },
  { id: "ambulance", ...CONTACT_DATA.ambulance },
];

export async function seedDB() {
  await db.contacts.bulkPut(CONTACT_DATA_ARRAY);
  await db.protocols.bulkPut(
    educationTopics.map((topic) => ({ id: topic.slug, ...topic }))
  );
}

export default db;
