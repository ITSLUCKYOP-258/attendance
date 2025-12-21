import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCx4L_h2kT0rnnTDHK7H3X-yojZmHcAnOI",
  authDomain: "attendance-a5e33.firebaseapp.com",
  projectId: "attendance-a5e33",
  storageBucket: "attendance-a5e33.firebasestorage.app",
  messagingSenderId: "502784239132",
  appId: "1:502784239132:web:ff0ef4249eecf84f8321d9",
  measurementId: "G-ET5FT2C9TF",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
