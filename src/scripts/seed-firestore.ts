
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, writeBatch, getDocs } from "firebase/firestore";
// Usamos una ruta relativa directa que Node.js pueda resolver sin problemas.
import { educationTopics } from "../lib/educationData";

// IMPORTANTE: Copia aquí la configuración de tu proyecto de Firebase
// La puedes encontrar en src/lib/firebase.ts
const firebaseConfig = {
  "projectId": "emergencia-ya",
  "appId": "1:487397458821:web:d0267ceef85c9650d87aec",
  "storageBucket": "emergencia-ya.firebasestorage.app",
  "apiKey": "AIzaSyBatCa-FemmnxARZHcPN9G2teSoEQnh58E",
  "authDomain": "emergencia-ya.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "487397458821"
};


// Inicializar Firebase de forma segura
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedEducationData() {
  const educationCollectionRef = collection(db, "education");

  console.log("Verificando si ya existen datos...");
  const existingDocs = await getDocs(educationCollectionRef);
  if (!existingDocs.empty) {
    console.log("La colección 'education' ya contiene datos. Para evitar duplicados, el script se detendrá.");
    console.log("Si quieres volver a cargar los datos, borra los documentos existentes en la consola de Firebase y ejecuta el script de nuevo.");
    return;
  }

  console.log("Comenzando a subir datos a Firestore...");

  // Usamos un batch para subir todos los documentos en una sola operación
  const batch = writeBatch(db);

  educationTopics.forEach((topic) => {
    // Usamos el slug como ID del documento para que sea predecible
    const docRef = doc(educationCollectionRef, topic.slug);
    batch.set(docRef, topic);
    console.log(`  -> Añadiendo '${topic.title}' al batch.`);
  });

  try {
    await batch.commit();
    console.log("\n¡Éxito! Todos los temas de educación se han subido correctamente a Firestore.");
  } catch (error) {
    console.error("\nError al subir los datos a Firestore:", error);
  }
}

seedEducationData().then(() => {
  console.log("\nProceso finalizado.");
  // Forzamos la salida del proceso ya que la conexión con Firebase lo mantiene activo.
  process.exit(0);
});
