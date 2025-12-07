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

      {/* 🔙 返回按鈕（完全不動！） */}
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

      {/* ⭐ 主容器 */}
      <div className="w-full h-full flex flex-col items-center mt-16 sm:mt-20 md:mt-24 lg:mt-28">

        {/* ⭐ 標題區（文字 RWD） */}
        <div className="w-full text-white px-4 py-3 flex items-center justify-center z-40">
          <div className="flex flex-col gap-2 text-center">

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider drop-shadow-lg">
              ✦ 未來錨點創造 ✦
            </h1>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
              請留下屬於您的時空足跡，成為南門市場新的記憶錨點
            </p>
          </div>
        </div>

        {/* ⭐ Canvas 區（保留原樣，僅加外距 RWD） */}
        <div className="flex-1 flex items-center justify-center w-full mt-2 px-2 sm:px-4 md:px-6">
          <InfiniteCanvas devUID="omHiZN80K8PP9ukH248hz2YqKgX2" />
        </div>

        {/* ⭐ 底部按鈕（加入 RWD，但不影響你的 class） */}
        <div className="absolute bottom-6 w-full flex justify-center z-50 mb-3">

          <button
            onClick={() => navigate("/gallery")}
            className="
              neon-black-btn         
              text-sm sm:text-base md:text-lg        /* 字體 RWD */
              px-4 sm:px-6 md:px-8 lg:px-10          /* 內距 RWD */
              py-2 sm:py-3 md:py-3.5                 /* 高度 RWD */
            "
          >
            前往時空維度走廊
          </button>

        </div>

      </div>

      {/* 過渡動畫 */}
      {transitioning && <TransitionOverlay visible={transitioning} />}
    </div>
  );
}



