import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup,createUserWithEmailAndPassword,onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, getDocs, query, where, serverTimestamp,writeBatch,setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk-bfqIVq7TPRnjl7AFxiGr9s6MzKkbMY",
  authDomain: "ad-connect-project.firebaseapp.com",
  projectId: "ad-connect-project",
  storageBucket: "ad-connect-project.firebasestorage.app",
  messagingSenderId: "1074004102277",
  appId: "1:1074004102277:web:7fac0ea3bb08933d316dec",
  measurementId: "G-H6VNJ6MW31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, onAuthStateChanged, signOut , db, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, getDocs, query, where,serverTimestamp, writeBatch, setDoc };