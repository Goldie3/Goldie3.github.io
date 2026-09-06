// firebase-config.js
// Reemplaza estos valores con los que te da la consola de Firebase
// (Configuración del proyecto -> Tus apps -> objeto firebaseConfig)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8MSaPN9IZVCly_SEb9_qb8R-F7S9mkI8",
  authDomain: "computacionenlanuba.firebaseapp.com",
  projectId: "computacionenlanuba",
  storageBucket: "computacionenlanuba.firebasestorage.app",
  messagingSenderId: "828472325406",
  appId: "1:828472325406:web:bf7ff1d3589e04e2e2450f",
  measurementId: "G-2PH6RVTQBY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);