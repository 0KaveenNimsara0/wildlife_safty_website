// Import the functions you need from the correct Firebase modules
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2BQuk-GQ5WV9CnT2q6Muio4cyVQm-mN8",
  authDomain: "wildlifesafty.firebaseapp.com",
  projectId: "wildlifesafty",
  storageBucket: "wildlifesafty.firebasestorage.app",
  messagingSenderId: "443242013612",
  appId: "1:443242013612:web:9f4a7150aee218201b1009",
  measurementId: "G-KQG9RD54QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export the services you'll need
export { 
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
};