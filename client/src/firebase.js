// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-60fd6.firebaseapp.com",
  projectId: "mern-60fd6",
  storageBucket: "mern-60fd6.firebasestorage.app",
  messagingSenderId: "713487840281",
  appId: "1:713487840281:web:7afda1fda7f608b477e688"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };