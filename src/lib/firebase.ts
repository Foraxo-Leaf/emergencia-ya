
import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  "projectId": "emergencia-ya",
  "appId": "1:487397458821:web:d0267ceef85c9650d87aec",
  "storageBucket": "emergencia-ya.firebasestorage.app",
  "apiKey": "AIzaSyBatCa-FemmnxARZHcPN9G2teSoEQnh58E",
  "authDomain": "emergencia-ya.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "487397458821"
};


// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
