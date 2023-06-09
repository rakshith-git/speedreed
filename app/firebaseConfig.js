
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCKHa3s0eICh8TU_HCwPUJLoVnGjqsHVNc",
  authDomain: "my-first-project-5a68f.firebaseapp.com",
  projectId: "my-first-project-5a68f",
  storageBucket: "my-first-project-5a68f.appspot.com",
  messagingSenderId: "878550779321",
  appId: "1:878550779321:web:ddfad79fa102177f72a268",
  measurementId: "G-7PLS7HX32G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const googleProvider =new GoogleAuthProvider();
export const db=getFirestore(app);