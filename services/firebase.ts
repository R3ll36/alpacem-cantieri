
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAL0KMOxIpG0BNvgCwN_7yRAE-UdDs9oEE",
  authDomain: "cantieri-app.firebaseapp.com",
  projectId: "cantieri-app",
  storageBucket: "cantieri-app.firebasestorage.app",
  messagingSenderId: "918635962086",
  appId: "1:918635962086:web:d25f4a52b4a9c0a2e56527",
  measurementId: "G-2RKN0F0SCG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
