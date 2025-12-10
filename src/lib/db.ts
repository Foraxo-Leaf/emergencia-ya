import Dexie from "dexie";
// CONTACT_DATA and educationTopics are no longer seeded into Dexie
// as they are handled by Remote Config and a local JSON file respectively.

const OUTBOX_SCHEMA = "++id,type,payload,created_at,nextAttemptAt,attempts";

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

db.version(3)
  .stores({
    contacts: "id,updated_at,deleted",
    protocols: "id,updated_at,deleted",
    incidents: "id,updated_at,deleted",
    attachments: "id,incidentId,updated_at,deleted",
    outbox: OUTBOX_SCHEMA,
    secure: "id",
  })
  .upgrade(async (tx) => {
    await tx
      .table("outbox")
      .toCollection()
      .modify((item) => {
        if (item.attempts === undefined) item.attempts = 0;
        if (item.nextAttemptAt === undefined) item.nextAttemptAt = 0;
      });
  });

// The seedDB function is no longer necessary as data is sourced differently.
// We keep the function but leave it empty to avoid breaking calls to it.
export async function seedDB() {
  // console.log("Seeding logic has been deprecated. Data is now managed by Remote Config and local JSON.");
}

export default db;
