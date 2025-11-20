// components/Countdown.jsx
import { useEffect, useState, useRef } from "react";

export default function Countdown({
  start = 3,
  onComplete,
  shutterAudioSrc = "/sounds/shutter-snap.mp3",
}) {
  const [count, setCount] = useState(start);
  const shutterAudioRef = useRef(null);

  useEffect(() => {
    if (count < 0) return;

    const timer = setTimeout(() => {
      if (count === 1) {
        // 倒數到 1 → 0 前播放快門音效
        if (shutterAudioRef.current) {
          shutterAudioRef.current.currentTime = 0;
          shutterAudioRef.current.play().catch(() => {});
        }
      }

      if (count === 0) {
        // 倒數結束
        onComplete && onComplete();
      } else {
        setCount(count - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  // 倒數結束不顯示
  if (count < 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="text-white text-6xl md:text-8xl font-bold drop-shadow-lg animate-fadeIn">
        {count > 0 ? count : ""}
      </div>

      {/* 拍照音效 */}
      <audio ref={shutterAudioRef} src={shutterAudioSrc} preload="auto" />
    </div>
  );
}

