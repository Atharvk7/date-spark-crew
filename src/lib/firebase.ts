import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaYgI_SMLy7ba3mYkOUiFhzBBmtU29j8k",
  authDomain: "the-date-crew.firebaseapp.com",
  projectId: "the-date-crew",
  storageBucket: "the-date-crew.firebasestorage.app",
  messagingSenderId: "315837828381",
  appId: "1:315837828381:web:c01d41332a94857eb4e5f4",
  measurementId: "G-WPQD3W5YEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
