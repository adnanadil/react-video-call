// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcatoqRE8XTU5JzCzAm3CEU2L8owYA5Bw",
  authDomain: "videocall-30941.firebaseapp.com",
  databaseURL: "https://videocall-30941-default-rtdb.firebaseio.com",
  projectId: "videocall-30941",
  storageBucket: "videocall-30941.appspot.com",
  messagingSenderId: "174052465354",
  appId: "1:174052465354:web:a8fc6f7a286f497f033233",
  measurementId: "G-HM8XLR11PC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
