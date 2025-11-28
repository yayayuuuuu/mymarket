// pages/IntroPage.jsx
import React, { useState } from "react";
import marketBg from "/public/images/intro.jpg";
import TransitionOverlay from "../components/TransitionOverlay";

export default function IntroPage({ onEnter }) {
  const [showTransition, setShowTransition] = useState(false);

  const handleClick = () => {
    // 開始過場動畫
    setShowTransition(true);

    // 過場動畫結束後觸發進入
    setTimeout(() => {
      setShowTransition(false);
      onEnter();
    }, 2000); // 過場動畫時間 2 秒，可調整
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between text-center overflow-hidden">
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

      {/* 標題 */}
      <div className="w-screen flex-1 flex items-center justify-center z-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-widest drop-shadow-lg animate-dropInSmooth">
          <br />
          記憶錨點
          <br />
          南門市場固著計畫
        </h1>
      </div>

      {/* 霓虹按鈕 */}
      <button
        className="mb-40 px-8 py-3 text-white rounded-xl neon-button z-20 animate-fadeInOnly animate-floatY"
        onClick={handleClick}
      >
        點擊開始！
      </button>

      {/* 過場動畫覆蓋 */}
      <TransitionOverlay visible={showTransition} />

      {/* CSS 動畫 */}
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }

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

        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}


