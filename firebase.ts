// Use named import instead of namespace import to resolve 'initializeApp' property errors
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // 방금 생성하신 진짜 마스터키입니다.
  apiKey: "AIzaSyCHW1U7o1mur0v6SiEyxAg9XoAvmQLiV9s", 
  // 파이어베이스 설정 화면(image_a78e92.png)의 정보와 정확히 일치시켰습니다.
  authDomain: "doldamhouse-92fd3.firebaseapp.com",
  projectId: "doldamhouse-92fd3", 
  storageBucket: "doldamhouse-92fd3.firebasestorage.app",
  messagingSenderId: "891837065227",
  appId: "1:891837065227:web:f935905c28cfb6b2c33f0e",
  measurementId: "G-JS3DDCFLMH"
};

// Fix: Initialize the app using the named import as per Firebase v9 modular SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
