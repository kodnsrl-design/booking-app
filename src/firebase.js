import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUAULIkazm693XOXaLDAkAJZvP0E8-o_w",
  authDomain: "family-reservation.firebaseapp.com",
  projectId: "family-reservation",
  storageBucket: "family-reservation.firebasestorage.app",
  messagingSenderId: "286442906155",
  appId: "1:286442906155:web:516922a9a0cbc68d7a406e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
