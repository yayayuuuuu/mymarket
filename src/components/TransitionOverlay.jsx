import React, { useEffect, useRef } from "react";

export default function TransitionOverlay({ visible, lineCount = 30, audioSrc = "/sounds/transition.mp3", fadeOutDuration = 1000 }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

  // 當 visible 變為 true 播放音效
  useEffect(() => {
    const audio = audioRef.current;
    if (!visible || !audio) return;

    audio.currentTime = 0;
    audio.volume = 1;
    audio.play().catch(err => console.log(err));

    // 開始淡出
    let start = null;
    const fadeOut = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const progress = Math.min(elapsed / fadeOutDuration,0.3);
      audio.volume = 1 - progress;

      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(fadeOut);
      } else {
        audio.pause();
        audio.volume = 1; // 下次播放恢復音量
      }
    };

    fadeRef.current = requestAnimationFrame(fadeOut);

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      audio.volume = 1; // 清理時重置音量
    };
  }, [visible, fadeOutDuration]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-black flex items-center justify-center pointer-events-none">
      {/* 音效 */}
      <audio ref={audioRef} src={audioSrc} />

      {/* 流光線條 */}
      {[...Array(lineCount)].map((_, i) => (
        <div
          key={i}
          className="flowing-line"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 1 + 0.8}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        ></div>
      ))}

      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .flowing-line {
          position: absolute;
          width: 2px;
          height: 100%;
          background: white;
          opacity: 0.2;
          animation-name: slideDown;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}



