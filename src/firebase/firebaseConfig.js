// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚡️ 將這裡的內容換成你 Firebase 控制台上提供的設定
const firebaseConfig = {
  apiKey: "AIzaSyCng9Ld7HnBH_DDNlmKwrWCYd6P6lHB-6E",
  authDomain: "marketwall-76d63.firebaseapp.com",
  projectId: "marketwall-76d63",
  storageBucket: "marketwall-76d63.appspot.com",
  messagingSenderId: "938403937490",
  appId: "1:938403937490:web:a2be5cf5c666fb1395410b",
  measurementId: "G-GQLZ3TBD6N"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore（畫布資料會存在這裡）
export const db = getFirestore(app);
export const storage = getStorage(app);
