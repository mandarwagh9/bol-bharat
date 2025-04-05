import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAUKVVAbPolZL0MpT0NptJ5ik39_Je3ee4", // Fallback value
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bolbharat-a24dc", // Fallback value
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1040076076256:web:1b4a233f9a7bb9573ccc85", // Fallback value
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, analytics, db };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
