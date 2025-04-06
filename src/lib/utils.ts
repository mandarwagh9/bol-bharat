import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that we have required Firebase config parameters
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error("Missing required Firebase configuration. Check your environment variables.");
}

let app, analytics, db;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getDatabase(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, analytics, db };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
