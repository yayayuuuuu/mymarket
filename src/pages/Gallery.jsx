import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
  const [boards, setBoards] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/future");
  };

  useEffect(() => {
    const q = query(collection(db, "boards"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoards(arr);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-black to-gray-100">

      {/* 🔙 返回按鈕 */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 w-16 h-16 flex items-center justify-center
                   bg-black bg-opacity-50 rounded-full shadow-lg hover:bg-opacity-80 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 5 5 12 12 19" />
        </svg>
      </button>

      {/* 標題 */}
      <div className="p-4 pb-2 mt-10">
        <h1 className="text-2xl font-bold text-center text-gray-100">
          時空維度走廊
        </h1>
      </div>

      {/* 中間內容 */}
<div className="flex-1 overflow-y-auto w-full">
  {boards.length === 0 ? (
    <div className="w-screen h-[calc(100vh-150px)] flex items-center justify-center">
      <p className="text-center text-gray-300 text-lg mt-20">
        目前還沒有作品
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-2 pb-6 mt-10 w-full">
      {boards.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow p-2 cursor-pointer"
          onClick={() => setPreviewImage(item.imageBase64)}
        >
          <img src={item.imageBase64} alt="board" className="w-full rounded" />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {item.createdAt?.toDate?.().toLocaleString?.() || ""}
          </p>
        </div>
      ))}
    </div>
  )}
</div>






      {/* 🔍 圖片預覽彈窗 */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm 
                     flex justify-center items-center p-4 z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative rounded-lg border-2 border-black bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3 bg-black text-white 
                         rounded-full w-8 h-8 flex items-center justify-center 
                         hover:bg-gray-800"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="preview"
              className="
                rounded
                max-h-[90vh]
                w-auto
                lg:max-w-[50vw]
                lg:max-h-[90vh]
                object-contain
              "
            />
          </div>
        </div>
      )}
    </div>
  );
}
