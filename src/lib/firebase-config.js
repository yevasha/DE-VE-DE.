import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCKqartjUi_WKh0OwVovvZe4eMkkLayCG0",
  authDomain: "devede-c50a4.firebaseapp.com",
  projectId: "devede-c50a4",
  storageBucket: "devede-c50a4.appspot.com",
  messagingSenderId: "83707558735",
  appId: "1:83707558735:web:65d760214ce2a625ab633a",
  measurementId: "G-LT6YHNR6JF",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
console.log("hello there");

export { firestore, database }