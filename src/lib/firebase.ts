
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn7u6WJgdKf2k6z8tD0cHgfMDo0Ff-Dj8",
  authDomain: "cogniassist-f6d15.firebaseapp.com",
  projectId: "cogniassist-f6d15",
  storageBucket: "cogniassist-f6d15.appspot.com", // Corrected to .appspot.com
  messagingSenderId: "874758674631",
  appId: "1:874758674631:web:8ef271c727288a432dc6e2",
  measurementId: "G-9DQXKD4L1P"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
