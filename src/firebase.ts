// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyCIL4kvdBRPbFH1Mob8cOBinlVrj0YeEV8",
  authDomain: "mi-lavado-899c7.firebaseapp.com",
  projectId: "mi-lavado-899c7",
  storageBucket: "mi-lavado-899c7.appspot.com",
  messagingSenderId: "998357297289",
  appId: "1:998357297289:web:cd290e61607e337454be58",
  measurementId: "G-XS47JXEWGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore (app);
