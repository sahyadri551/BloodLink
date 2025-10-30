import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_qtifH5U2KGU8e5AtCixv5ZjFzXUp-6Y",
  authDomain: "blood-link-cc143.firebaseapp.com",
  projectId: "blood-link-cc143",
  storageBucket: "blood-link-cc143.firebasestorage.app",
  messagingSenderId: "900545613365",
  appId: "1:900545613365:web:49e4467bcfbf6627e3eb7c",
  measurementId: "G-082JWCNK9H"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);