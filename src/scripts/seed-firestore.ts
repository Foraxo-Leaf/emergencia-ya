
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, writeBatch, getDocs, deleteDoc } from "firebase/firestore";

// Esta data ahora está en el código de la app, el script ya no la necesita.
// import { educationTopics } from "../lib/educationData"; 

const firebaseConfig = {
  "projectId": "emergencia-ya",
  "appId": "1:487397458821:web:d0267ceef85c9650d87aec",
  "storageBucket": "emergencia-ya.firebasestorage.app",
  "apiKey": "AIzaSyBatCa-FemmnxARZHcPN9G2teSoEQnh58E",
  "authDomain": "emergencia-ya.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "487397458821"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearEducationData() {
  const educationCollectionRef = collection(db, "education");
  console.log("Limpiando datos antiguos de la colección 'education'...");
  
  const existingDocs = await getDocs(educationCollectionRef);
  if (existingDocs.empty) {
    console.log("La colección 'education' ya está vacía. No se necesita limpieza.");
    return;
  }

  const batch = writeBatch(db);
  existingDocs.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  try {
    await batch.commit();
    console.log("Colección 'education' limpiada con éxito.");
  } catch (error) {
    console.error("Error limpiando la colección 'education':", error);
    // Termina el script si no se puede limpiar, para evitar datos inconsistentes.
    throw error;
  }
}

async function main() {
    console.log("Este script ya no es necesario para los datos de educación, ya que ahora están hardcodeados en la aplicación.");
    console.log("Ejecutando una última limpieza de la colección 'education' en Firestore para completar la migración.");
    await clearEducationData();
    console.log("\nProceso finalizado. Puedes eliminar este script del proyecto si lo deseas.");
}

main().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
