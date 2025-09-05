import Dexie from "dexie";

export const db = new Dexie("emergencia");

db.version(1).stores({
  contacts: "id,updated_at,deleted",
  protocols: "id,updated_at,deleted",
  incidents: "id,updated_at,deleted",
  attachments: "id,incidentId,updated_at,deleted",
  outbox: "++id,type,payload,created_at",
});

export default db;
