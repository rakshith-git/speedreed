// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjiaZ2YcOqs2DBQ5ocVT-5MO9_OYTS3nk",
  authDomain: "speedreed-database.firebaseapp.com",
  projectId: "speedreed-database",
  storageBucket: "speedreed-database.appspot.com",
  messagingSenderId: "112807792006",
  appId: "1:112807792006:web:63914cd67218854d4ff007",
  measurementId: "G-PKEWF4T9D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const googleProvider =new GoogleAuthProvider();
export const db=getFirestore(app);