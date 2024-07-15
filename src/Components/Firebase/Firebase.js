// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJMnMKootoUg-whZDO5E7MjUFH4RJxQwQ",
  authDomain: "ctlab-c777b.firebaseapp.com",
  projectId: "ctlab-c777b",
  storageBucket: "ctlab-c777b.appspot.com",
  messagingSenderId: "841136569211",
  appId: "1:841136569211:web:86488e30a5ea79be589bde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

