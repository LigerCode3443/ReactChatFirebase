import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "enotchat-4d351.firebaseapp.com",
  projectId: "enotchat-4d351",
  storageBucket: "enotchat-4d351.appspot.com",
  messagingSenderId: "813180106278",
  appId: "1:813180106278:web:94ecaf276a6cdaba8658e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
