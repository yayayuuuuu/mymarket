import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteCanvas from "../components/InfiniteCanvas";
import TransitionOverlay from "../components/TransitionOverlay";

export default function FutureUniverse() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleBack = () => {
    setTransitioning(true);
    setTimeout(() => {
      navigate("/", { state: { scrollTo: "/future" } });
    }, 1500);
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-black via-purple-950 to-blue-950 overflow-hidden text-white">

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

      {/* ⭐ 整體內容容器：水平＋垂直置中 */}
      <div className="w-full h-full flex flex-col items-center mt-20">

        {/* 頁面標題（固定在上方） */}
        <div className="w-full  text-white px-4 py-3 flex items-center justify-center  z-40">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-4xl font-bold tracking-wider drop-shadow-lg">
              ✦ 未來宇宙 ✦
            </h1>
            <p className="text-sm text-gray-300">
              發揮創意畫下未來10年、20年後的南門市場
            </p>
          </div>
        </div>

        {/* ⭐ Canvas 區垂直置中：讓畫布區撐滿剩下高度 */}
        <div className="flex-1 flex items-center justify-center w-full mt-2">
          <InfiniteCanvas devUID="omHiZN80K8PP9ukH248hz2YqKgX2" />
        </div>

        {/* 底部固定按鈕 */}
        <div className="absolute bottom-6 w-full flex justify-center z-50 mb-10">
         <button onClick={() => navigate("/gallery")} className="neon-black-btn">
  🎨 前往展示牆
</button>

        </div>

      </div>

      {/* 過渡動畫 */}
      {transitioning && <TransitionOverlay visible={transitioning} />}
    </div>
  );
}

