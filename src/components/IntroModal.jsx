import React, { useState, useEffect, useRef } from "react";

export default function IntroModal({ visible, onClose }) {
  const fullText = `為了維護南門市場在時空裂縫中的穩定度，請您實地踏查並留下影像錨點，增加南門市場的固著度吧！`;

  const [displayText, setDisplayText] = useState("");
  const [finished, setFinished] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const typingAudioRef = useRef(null);

  // 打字音效
  useEffect(() => {
    typingAudioRef.current = new Audio("/sounds/type.mp3");
    typingAudioRef.current.volume = 0.3;
    typingAudioRef.current.loop = true;
  }, []);

  // 打字效果
  useEffect(() => {
    if (!visible) return;

    setDisplayText("");
    setFinished(false);

    let index = 0;

    // 播放循環音效
    if (typingAudioRef.current) {
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.play().catch(() => {});
    }

    const interval = setInterval(() => {
      index++;
      setDisplayText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(interval);
        setFinished(true);

        // 停止音效
        if (typingAudioRef.current) {
          typingAudioRef.current.pause();
          typingAudioRef.current.currentTime = 0;
        }
      }
    }, 55);

    return () => {
      clearInterval(interval);
      if (typingAudioRef.current) {
        typingAudioRef.current.pause();
        typingAudioRef.current.currentTime = 0;
      }
    };
  }, [visible]);

  // 光標閃爍
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
      {/* 背景模糊圖片 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/present3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: -1,
        }}
      />

      {/* 浮窗卡片 */}
      <div className="bg-white rounded-3xl p-8 max-w-xl text-center shadow-lg border border-[rgba(200,180,160,0.3)] pointer-events-auto">
        <p className="font-serif text-gray-800 text-lg md:text-xl mb-6 leading-relaxed tracking-wide">
          {displayText}
          {showCursor && <span className="animate-pulse">|</span>}
        </p>

        {finished && (
          <button
            onClick={onClose}
            className="mt-4 px-8 py-3 bg-[rgba(250,250,250,1)] text-gray-800 rounded-full border border-gray-300 hover:bg-[rgba(245,245,245,1)] transition-all duration-300 shadow-sm font-medium"
          >
            開市採集固著影像
          </button>
        )}
      </div>
    </div>
  );
}

