// src/firebase/useCanvasStore.js
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// 儲存筆畫
export const saveLine = async (line) => {
  await addDoc(collection(db, "canvasLines"), line);
};

// 載入全部筆畫
export const loadLines = async () => {
  const querySnapshot = await getDocs(collection(db, "canvasLines"));
  return querySnapshot.docs.map((d) => d.data());
};

// 清空畫布（只有開發者使用）
export const clearCanvas = async () => {
  const querySnapshot = await getDocs(collection(db, "canvasLines"));
  const deletions = querySnapshot.docs.map((d) => deleteDoc(doc(db, "canvasLines", d.id)));
  await Promise.all(deletions);
};
