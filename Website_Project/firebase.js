import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYQyj2kqNTU1xBay-y1xG5pqoU9BQm3V4",
  authDomain: "essumainrops.firebaseapp.com",
  projectId: "essumainrops",
  storageBucket: "essumainrops.firebasestorage.app",
  messagingSenderId: "505373962247",
  appId: "1:505373962247:web:d2822c97d10385a1a47aa2",
  measurementId: "G-ZDKTK7ZJY9"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);