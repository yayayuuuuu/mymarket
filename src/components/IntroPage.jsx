// pages/IntroPage.jsx
import React, { useState } from "react";
import marketBg from "/public/images/intro.png";
import TransitionOverlay from "../components/TransitionOverlay";

export default function IntroPage({ onEnter }) {
  const [showTransition, setShowTransition] = useState(false);

  const handleClick = () => {
    setShowTransition(true);

    setTimeout(() => {
      setShowTransition(false);
      onEnter();
    }, 2000);
  };

  return (
    <div className="relative w-screen min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* 背景照片 */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${marketBg})` }}
      ></div>

      {/* 星空動畫 */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 150 }).map((_, i) => (
          <span
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 1.5 + 1}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></span>
        ))}
      </div>

      {/* ⭐ 中央內容區塊：水平垂直置中 */}
      <div className="z-20 flex flex-col items-center justify-center mt-10">
        
        {/* 標題 */}
        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-widest drop-shadow-lg animate-dropInSmooth text-outline">
          <br />
          記憶錨點
          <br />
          南門市場固著計畫
        </h1>

        {/* 說明文字：淡入上浮 */}
        <div className="relative w-11/12 max-w-2xl mt-4 mb-10">
  {/* 左上釘子 */}
  <div
    className="
      absolute -top-3 -left-3
      w-5 h-5
      bg-pink-600
      rounded-full
      shadow-md
      border-2 border-white
    "
  ></div>

  <div
    className="
      w-full
      p-6 rounded-2xl shadow-lg
      text-gray-800 backdrop-blur-md animate-fadeInUp
    "
    style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
  >
    <p className="text-sm md:text-xl leading-relaxed font-medium">
      在這個網頁裡，你不是旁觀者。<br />
      點擊開始，你的照片、你的筆跡、你的腳步<br />
      都會留在南門市場的故事裡。<br /><br />
      ＂滑動底片，看見過去＂<br />
      ＂按下拍立得，留住現在＂<br />
      ＂最後，用你的畫筆寫下未來＂
    </p>
  </div>
</div>


        {/* 霓虹按鈕：延遲淡入上浮 */}
        <button
          className="px-8 py-3 text-white rounded-xl neon-button animate-fadeInUpDelay mt-20"
          onClick={handleClick}
        >
          點擊開始！
        </button>

      </div>

      {/* 過場動畫覆蓋 */}
      <TransitionOverlay visible={showTransition} />

      {/* CSS 動畫 */}
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }

        /* 標題下落動畫 */
        @keyframes dropInSmooth {
          0% {
            opacity: 0;
            transform: translateY(-40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropInSmooth {
          animation: dropInSmooth 1.2s ease-out forwards;
        }

        /* 說明文字浮現 */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        /* 按鈕延遲浮現 */
        .animate-fadeInUpDelay {
          animation: fadeInUp 1.2s ease-out forwards;
          animation-delay: 0.3s;
        }

        /* 霓虹按鈕閃爍 */
        @keyframes neonButtonTwinkle {
          0%,100% {
            text-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 20px #0ff,0 0 40px #0ff;
            box-shadow:0 0 10px #0ff,0 0 20px #0ff,0 0 30px #0ff,0 0 50px #0ff;
          }
          25% {
            text-shadow:0 0 10px #0ff,0 0 20px #0ff,0 0 30px #0ff,0 0 40px #0ff;
            box-shadow:0 0 20px #0ff,0 0 40px #0ff,0 0 60px #0ff,0 0 60px #0ff;
          }
        }
        .neon-button {
          text-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 20px #0ff,0 0 40px #0ff;
          border:2px solid #0ff;
          background-color: rgba(0,0,0,0.2);
          font-size: clamp(16px, 2vw, 24px);
          cursor: pointer;
          animation: neonButtonTwinkle 1.5s ease-in-out infinite alternate;
          transition: all 0.3s ease;
        }
        .neon-button:hover {
          background-color: rgba(0,255,255,0.1);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}



