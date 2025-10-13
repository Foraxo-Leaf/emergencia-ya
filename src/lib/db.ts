import Dexie from "dexie";
// CONTACT_DATA and educationTopics are no longer seeded into Dexie
// as they are handled by Remote Config and a local JSON file respectively.

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

// The seedDB function is no longer necessary as data is sourced differently.
// We keep the function but leave it empty to avoid breaking calls to it.
export async function seedDB() {
  // console.log("Seeding logic has been deprecated. Data is now managed by Remote Config and local JSON.");
}

export default db;
