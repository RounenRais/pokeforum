import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAu4ist7aMzLzPbu1pjMXRW5Im78REI0qA",
  authDomain: "pokeforum-209de.firebaseapp.com",
  projectId: "pokeforum-209de",
  storageBucket: "pokeforum-209de.firebasestorage.app",
  messagingSenderId: "238349331029",
  appId: "1:238349331029:web:efd646d3c8512781ef42dc",
  measurementId: "G-ZMQXZVTKTN"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };