// This file is for your main React application, NOT the service worker.

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC88qAilHqJD0XdOlSvwtNZfNwtVq27FR8",
  authDomain: "queue-in-88.firebaseapp.com",
  projectId: "queue-in-88",
  storageBucket: "queue-in-88.firebasestorage.app",
  messagingSenderId: "838543402509",
  appId: "1:838543402509:web:49d93e3110439443961744",
  measurementId: "G-PL0TKQ8XLD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
